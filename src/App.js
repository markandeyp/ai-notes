import { useState } from "react";
import "./App.css";
import ImageUploading from "react-images-uploading";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { ColorRing } from "react-loader-spinner";

const STORAGE_PATH = "notes";

export const App = ({ firebaseApp }) => {
  const [images, setImages] = useState([]);
  const [output, setOutput] = useState(null);
  const storage = getStorage(firebaseApp);
  const db = getFirestore(firebaseApp);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (imageList) => {
    setOutput(null);
    setImages(imageList);
  };

  const uploadImage = () => {
    setIsLoading(true);

    if (!storage || !images) {
      return;
    }
    const image = images.at(0);
    const imageRef = ref(storage, `${STORAGE_PATH}/${image.file.name}`);
    uploadBytes(imageRef, image.file).then((snapshot) => {
      const unsubscribe = onSnapshot(
        collection(db, "extractedText"),
        (data) => {
          if (data) {
            data.docChanges().forEach((change) => {
              if (change.type === "added" && snapshot.ref) {
                const data = change.doc.data();
                if (data.file.endsWith(snapshot.ref.fullPath)) {
                  setOutput(data.text);
                  setIsLoading(false);
                  unsubscribe();
                }
              }
            });
          }
        }
      );
    });
  };

  return (
    <>
      <div className="d-flex flex-column align-items-center gap-5 justify-content-center p-5">
        <p className="m-auto display-4">AI Notes</p>
        <ImageUploading value={images} onChange={onChange} maxNumber={10}>
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            isDragging,
            dragProps,
          }) => (
            <div className="d-flex gap-5 flex-column align-items-center">
              <div className="d-flex gap-5">
                <button
                  className={`btn btn-lg ${
                    isDragging ? "btn-danger" : "btn-primary"
                  }`}
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  Click or Drop here
                </button>

                <button
                  className="btn btn-lg btn-danger"
                  onClick={onImageRemoveAll}
                  disabled={!imageList || !imageList.length}
                >
                  Remove Image
                </button>
              </div>
            </div>
          )}
        </ImageUploading>
        <div className="d-flex gap-5 justify-content-center">
          <div className="d-flex w-50 flex-wrap justify-content-center">
            {images.map((image, index) => (
              <div key={index} className="w-100">
                <img
                  width="100%"
                  className="mb-5"
                  src={image.dataURL}
                  alt={image.file.name}
                />
                <button
                  className="btn m-auto btn-primary"
                  onClick={uploadImage}
                >
                  Process
                </button>
              </div>
            ))}
          </div>
          {output && (
            <div className="d-flex card shadow w-50 p-5">
              <div className="h-75 fs-4 text-justify">{output}</div>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="position-absolute left-0 top-0 h-100 w-100 d-flex opacity-25 justify-content-center align-items-center">
          <ColorRing
            visible={true}
            height="200"
            width="200"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      )}
    </>
  );
};
