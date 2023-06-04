import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Home.module.scss";
import {
  faEllipsisVertical,
  faXmark,
  faCheck,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import useClickOutside from "./hooks/useClickOutside";
import config from "./urls";

function useArticles() {
  const [articles, setArticles] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [titleToChange, setTitleToChange] = useState(null);

  const getArticles = async () => {
    const res = await axios.get(config.articlesURL);

    if (res.status !== 200) {
      console.error("Something went wrong", res.status);
      return;
    }
    setArticles(res.data);
  };
  const deleteArticle = async (id) => {
    const res = await axios.delete(config.articleURL(id));
    if (res.status === 204) {
      setArticles(articles.filter((article) => article.id !== id));
    }
  };
  const updatePublishStatus = async (id, status) => {
    const res = await axios.put(config.articleURL(id), { status: status });

    if (res.status === 204) {
      setArticles(
        articles.map((article) => {
          if (article.id === id) {
            article.status = status;
          }
          return article;
        })
      );
    }
  };

  const options = (isPublished) => [
    {
      name: "Obrisi",
      onClick: (index) => {
        deleteArticle(index);
        setContextMenu(null);
      },
    },
    {
      name: isPublished ? "Sakrij objavu" : "Objavi",
      onClick: (id) =>
        updatePublishStatus(id, isPublished ? "unpublished" : "published"),
    },
    {
      name: "Promeni naslov",
      onClick: (index) => {
        changeTitle(index);
      },
    },
    {
      includePlayButton: true,
      name: "Snimi",
      onClick: async (id) => {
        const response = await axios.post(config.audioURL(id));
        console.log(response);
      },
    },
  ];
  const changeTitle = (index) => {
    setTitleToChange(index);
    setContextMenu(null);
  };
  const stopChangingTitle = () => {
    setTitleToChange(null);
  };
  useEffect(() => {
    getArticles();
  }, []);
  return {
    options,
    articles,
    setContextMenu,
    contextMenu,
    titleToChange,
    stopChangingTitle,
  };
}

export default function HomePage() {
  const {
    options,
    articles,
    setContextMenu,
    contextMenu,
    titleToChange,
    stopChangingTitle,
  } = useArticles();
  return (
    <main className={styles.main}>
      <div className={styles.home}>
        <h1>Pocetna</h1>
        <hr
          style={{
            color: "black",
            backgroundColor: "black",
            height: 2,
            maxWidth: "90%",
            float: "left",
            padding: 0,
            margin: "0 0 2em 0",
          }}
        />
        <div className={styles.createContainer}>
          <Link className={styles.create} to={"/document/new"}>
            Napravi
          </Link>
        </div>
        <section className={styles.cardContainer}>
          {articles.map((article, index) => {
            return (
              <div key={article.id} className={styles.card}>
                {contextMenu !== index ? (
                  <>
                    <Link to={`/document/${article.id}`}>
                      <img
                        className={styles.img}
                        alt="article"
                        src={article.bannerImg}
                      />
                    </Link>
                    <div className={styles.titleContainer}>
                      {titleToChange !== index ? (
                        <Link
                          to={`/document/${article.id}`}
                          style={{ textDecoration: "none", maxWidth: "80%" }}
                        >
                          <h3 className={styles.articleTitle}>
                            {article.title}
                          </h3>
                        </Link>
                      ) : (
                        <div>
                          <input />

                          <button>
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button onClick={stopChangingTitle}>
                            <FontAwesomeIcon icon={faXmark} />
                          </button>
                        </div>
                      )}

                      <button
                        className={styles["article-options-btn"]}
                        onClick={() => setContextMenu(index)}
                      >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </button>
                    </div>
                  </>
                ) : (
                  <ContextMenu
                    id={article.id}
                    options={(status) => options(status)}
                    isPublished={article.status === "published"}
                    onClickOutside={() => setContextMenu(null)}
                  />
                )}
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}

function ContextMenu({ options, id, onClickOutside, isPublished }) {
  const { ref } = useClickOutside(onClickOutside);
  return (
    <ul ref={ref} className={styles.contextMenu}>
      {options &&
        options(isPublished).map((option, i) => {
          return (
            <li key={i}>
              <button
                className={styles.actionBtn}
                onClick={() => {
                  option.onClick(id);
                }}
              >
                {option.name}
              </button>
              {option.includePlayButton && <PlayButton id={id} />}
            </li>
          );
        })}
    </ul>
  );
}

function PlayButton({ id }) {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const getAudio = async () => {
    const response = await axios.get(config.audioURL(id));
    console.log(response.data);
    if (response.status === 200) {
      const new_audio = new Audio(response.data);
      setAudio(new_audio);
      return true;
    }
    return null;
  };
  const togglePlay = async () => {
    if (!audio) await getAudio();
    if (!isPlaying && audio) {
      audio.play();
      setIsPlaying(true);
    } else if (audio) {
      setIsPlaying(false);
      audio.pause();
    } else console.log(audio, isPlaying);
  };
  return (
    <button onClick={() => togglePlay()} className={styles.playBtn}>
      <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
    </button>
  );
}
