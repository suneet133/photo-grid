import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import "./App.css";

function ImageCard(props) {
  const [like, setLike] = useState(false);
  function doubleClicked() {
    setLike((value) => true);
    setTimeout(() => {
      setLike((value) => false);
    }, 1200);
  }
  return (
    <>
      {props.image && (

        <div className="card" onDoubleClick={(event) => doubleClicked(event)}>
          <div className="card_image">
            <img src={props.image.thumbnailUrl} alt="Placeholder image" />

            <CSSTransition
              in={like}
              timeout={1200}
              classNames="fade"
              unmountOnExit
            >
              <div className="icon icon-center">
                <i className="fas fa-heart fa-2xl red-icon"></i>
              </div>
            </CSSTransition>
          </div>
          <div className="card_title title-white">
            <p>{props.image.title}</p>
          </div>
          <div className="card-footer">
            <p><strong>Album:</strong> {props.image.albumName}</p>
          </div>
        </div>

      )}
    </>
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [imageResults, setImageResults] = useState([]);
  const [gridView, setGridView] = useState(true);
  const [singleImage, setSingleImage] = useState({});
  function getRandomId() {
    return Math.floor(Math.random() * 5000);
  }
  function fetchPhotos() {
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((response) => response.json())
      .then((results) => {
        //console.log(results);
        setImageResults(results);
      });
  }
  function assignImages() {
    let array = [];
    for (let i = 0; i < 9; i++) {
      array.push(imageResults[getRandomId()]);
    }

    fetchAlbumDetails(array)
  }

  function fetchAlbumDetails(array) {
    fetch("https://jsonplaceholder.typicode.com/albums")
        .then((response) => response.json())
        .then((results) => {
          results.forEach((item) => {
            for (let i = 0; i < array.length; i++) {
              console.log(array[i])
              console.log(array)
              if (array[i].albumId === item.id) {
                array[i].albumName = item.title;
              }
            }
          })
          setPosts(array);
        });
  }

  function showSingleImage(post) {
    console.log(post);
    setSingleImage(post);
    setGridView((value) => false);
  }
  function backToGrid() {
    setGridView((value) => true);
  }

  useEffect(() => {
    fetchPhotos();
  }, []);
  useEffect(() => {
    assignImages();
  }, [imageResults]);
  return (
    <div className="section has-background-black">
      {gridView && (
        <div className="container">
          <p>
            <button className="button" onClick={() => assignImages()}>
              Refresh
            </button>
          </p>
          {posts && (
            <div className="centered">
              <div className="cards-list">
                {posts.map((post, index) => (
                    <div key={index}>
                      <a onClick={() => showSingleImage(post)}>
                        <ImageCard image={post} />
                      </a>
                    </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {!gridView && (
        <div className="singleView">
          <div>
            <button
              className="button"
              style={{ marginLeft: "1rem" }}
              onClick={() => backToGrid()}
            >
              Back
            </button>
            <ImageCard image={singleImage} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
