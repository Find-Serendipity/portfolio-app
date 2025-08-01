import React, { useEffect, useState } from "react";
import "./Portfolio.css";
import { mediaCategories } from "./media-categories.jsx";

const Portfolio = () => {
  const [media, setMedia] = useState([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const imageModules = import.meta.glob(
      "../assets/images/*.{png,jpg,jpeg,svg}"
    );
    const videoModules = import.meta.glob("../assets/images/*.{mp4,webm,ogg}");

    const allModules = { ...imageModules, ...videoModules };

    const promises = Object.entries(allModules).map(
      async ([path, importer]) => {
        const module = await importer();
        const src = module.default;
        const fileName = path.split("/").pop();
        const type = videoModules[path] ? "video" : "image";

        let category = "other";
        for (const cat in mediaCategories) {
          if (mediaCategories[cat].includes(fileName)) {
            category = cat;
            break;
          }
        }
        return { src, type, category, fileName };
      }
    );

    Promise.all(promises).then(setMedia);
  }, []);

  const filteredMedia =
    activeCategory === "all"
      ? media
      : media.filter((item) => item.category === activeCategory);

  const handleMediaClick = (item) => {
    const index = filteredMedia.findIndex(
      (mediaItem) => mediaItem.fileName === item.fileName
    );
    setSelectedMediaIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedMediaIndex(null);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedMediaIndex((prevIndex) =>
      prevIndex === filteredMedia.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = (e) => {
    e.stopPropagation();
    setSelectedMediaIndex((prevIndex) =>
      prevIndex === 0 ? filteredMedia.length - 1 : prevIndex - 1
    );
  };

  const selectedMedia =
    selectedMediaIndex !== null ? filteredMedia[selectedMediaIndex] : null;

  return (
    <div>
      <header>
        <h2>Click for Larger View</h2>
        <div className="tabs">
          <button
            onClick={() => setActiveCategory("all")}
            className={activeCategory === "all" ? "active" : ""}
          >
            All
          </button>
          {Object.keys(mediaCategories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={activeCategory === category ? "active" : ""}
            >
              {(category.charAt(0).toUpperCase() + category.slice(1)).replace(
                /_/g,
                " "
              )}
            </button>
          ))}
        </div>
      </header>
      <div className="portfolio-grid">
        {filteredMedia.map((item) => (
          <div
            key={item.fileName}
            className="portfolio-item"
            onClick={() => handleMediaClick(item)}
          >
            {item.type === "image" ? (
              <img src={item.src} alt={`Portfolio item ${item.fileName}`} />
            ) : (
              <video>
                <source
                  src={item.src}
                  type={`video/${item.src.split(".").pop()}`}
                />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>

      {selectedMedia && (
        <div className="modal" onClick={handleCloseModal}>
          <button className="prev" onClick={handlePrevious}>
            &#10094;
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            {selectedMedia.type === "image" ? (
              <img src={selectedMedia.src} alt="Expanded view" />
            ) : (
              <video controls autoPlay>
                <source
                  src={selectedMedia.src}
                  type={`video/${selectedMedia.src.split(".").pop()}`}
                />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <button className="next" onClick={handleNext}>
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
