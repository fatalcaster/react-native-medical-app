import styles from "./Create.module.scss";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "./urls";
export default function Create() {
  const navigate = useNavigate();

  const [bannerImg, setBannerImg] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState(null);
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (bannerImg) return;
      if (bannerImg) {
        URL.revokeObjectURL(bannerImg.blob);
      }
      setBannerImg({
        blob: URL.createObjectURL(acceptedFiles[0]),
        file: acceptedFiles[0],
      });
    },
    [bannerImg]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,

    multiple: false,
    maxFiles: 1,
    noKeyboard: true,
    noClick: true,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
  });
  const removeImage = () => {
    URL.revokeObjectURL(bannerImg);
    setBannerImg(null);
  };
  const onSubmit = async () => {
    if (title === "")
      setError({
        banner: error.banner,
        title: true,
      });
    if (bannerImg === null)
      setError({
        banner: true,
        title: error.title,
      });

    if (error.title || error.banner) return;

    const formData = new FormData();
    formData.append("banner", bannerImg.file);
    formData.append("title", title);
    const response = await axios.post(config.createArticleURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status !== 201) {
      setServerError(true);
      return;
    }
    console.log(response.data.id);
    return navigate(`/document/${response.data.id}`);
  };
  return (
    <main className={styles.main}>
      <div className={styles.dropZone} {...getRootProps()}>
        <input {...getInputProps()} />
        <div className={styles.imageContainer}>
          {bannerImg ? (
            <>
              <button
                type="button"
                onClick={removeImage}
                className={styles.removeImageBtn}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <img className={styles.bannerImg} alt="Banner" src={bannerImg.blob} />
            </>
          ) : error.banner ? (
            <p className={styles.error}>
              Dokument mora imati naslovnu fotografiju
            </p>
          ) : (
            <p>Prevuci sliku ovde</p>
          )}
        </div>
      </div>
      <label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Naslov..."
          className={styles.titleInput}
        />
        {error.title && (
          <p className={styles.error}>Dokument mora imati naslov</p>
        )}
      </label>

      <button onClick={onSubmit} className={styles.create} type="submit">
        Nastavi
      </button>
      {serverError && <p className={styles.error}>Nesto je poslo naopako</p>}
    </main>
  );
}
