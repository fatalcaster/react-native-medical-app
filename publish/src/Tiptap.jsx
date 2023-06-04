import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import Link from "@tiptap/extension-link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useKey from "./hooks/useKey";
import {
  faArrowLeft,
  faBold,
  faFloppyDisk,
  faHeading,
  faItalic,
  faList,
  faListOl,
  faParagraph,
  faRotateLeft,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Editor.module.scss";
// import objectHash from "object-hash";
import TextAlign from "@tiptap/extension-text-align";
import config from "./urls";
import { Link as ReactLink } from "react-router-dom";
import axios from "axios";
import { hashString } from "./helpers";

const SavingStatus = {
  Unsaved: 1,
  Saving: 2,
  Saved: 3,
};
console.info(config);
const Tiptap = ({ id }) => {
  const [initialDocumentHash, setInitialDocumentHash] = useState(null);
  const [savingStatus, setSavingStatus] = useState(SavingStatus.Saved);
  const [imgList, setImgList] = useState([]);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      TextAlign.configure({ defaultAlignment: "justify" }),
      Image.configure({
        HTMLAttributes: { class: styles.img, id: Math.random() },
      }),

      Link.configure({
        validate: (href) => /^https?:\/\//.test(href),
      }),
    ],
    content: "",
  });

  const addImage = useCallback(
    (url, name) => {
      if (url) {
        editor
          .chain()
          .focus()
          .setImage({ src: url, alt: name })
          .setTextAlign("center")
          .run();
      }
    },
    [editor]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const imgUrl = URL.createObjectURL(acceptedFiles[0]);
      setImgList([...imgList, acceptedFiles[0]]);
      addImage(imgUrl, acceptedFiles[0].name);
    },

    noClick: true,
  });
  const focusEditor = () => {
    if (!editor.isFocused) editor.chain().focus("end").run();
  };
  const getInitialArticleState = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/article/${id}`;
    const response = await axios.get(url);
    if (response.status === 200) {
      if (response.data && response.data.document) {
        editor.commands.setContent(JSON.parse(response.data.document));
      }

      return;
    }
    console.error("Something went wrong - couldn't get the initial article");
  };
  const saveArticle = async () => {
    if (savingStatus === SavingStatus.Saving) return;
    if (editor === null) {
      console.error("There is no editor to attach to");
      return;
    }
    console.log("Proso");
    setSavingStatus((_state) => SavingStatus.Saving);
    const json = JSON.stringify(editor.getJSON());
    const current_hash = hashString(json);
    console.log(current_hash, initialDocumentHash);
    if (current_hash === initialDocumentHash) {
      setTimeout(() => {
        setSavingStatus(SavingStatus.Saved);
      }, 3000);
      return;
    }
    console.log("SAVING...");

    const formData = new FormData();
    for (let i = 0; i < imgList.length; i++) {
      formData.append("images", imgList[i]);
    }
    formData.append("document", json);
    try {
      await axios.put(config.updateArticleURL(id), formData);
      setInitialDocumentHash(current_hash);
      setTimeout(() => {
        setSavingStatus(SavingStatus.Saved);
      }, 3000);
    } catch (err) {
      console.error("Something went wrong - couldn't update the article");
      setTimeout(() => setSavingStatus(SavingStatus.Unsaved), 3000);
    }
  };
  useKey("ctrls", saveArticle);
  useEffect(() => {
    if (!editor) return;
    getInitialArticleState();
    setInitialDocumentHash(() => hashString(JSON.stringify(editor.getJSON())));
  }, [editor]);
  if (editor === null) return null;
  return (
    <>
      <MenuBar editor={editor} save={saveArticle} />
      <div {...getRootProps()} className={styles.documentContainer}>
        <input {...getInputProps()} />

        <EditorContent
          onClick={focusEditor}
          className={styles.editor}
          editor={editor}
        />
      </div>
    </>
  );
};

export default Tiptap;

const MenuBar = ({ editor, save }) => {
  // const [initialDocumentState, setInitialDocumentState] = useState();
  if (!editor) {
    return null;
  }
  return (
    <div className={styles.container}>
      <ReactLink to="/" className={styles.backToFiles}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </ReactLink>
      <div className={styles.commandContainer}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? styles["is-active"] : ""}
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? styles["is-active"] : ""}
        >
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? styles["is-active"] : ""}
        >
          <FontAwesomeIcon icon={faParagraph} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? styles["is-active"] : ""
          }
        >
          <FontAwesomeIcon icon={faHeading} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? styles["is-active"] : ""}
        >
          <FontAwesomeIcon icon={faList} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? styles["is-active"] : ""}
        >
          <FontAwesomeIcon icon={faListOl} />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <FontAwesomeIcon icon={faRotateRight} />
        </button>
        <button onClick={() => save()}>
          <FontAwesomeIcon icon={faFloppyDisk} />
        </button>
      </div>
    </div>
  );
};
