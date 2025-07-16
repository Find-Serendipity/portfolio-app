import React, { useEffect, useState } from "react";
import "./Portfolio.css";
import { mediaCategories } from "./media-categories.jsx";

const Portfolio = () => {
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
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

  const handleMediaClick = (item) => {
    setSelectedMedia(item);
  };

  const handleCloseModal = () => {
    setSelectedMedia(null);
  };

  const filteredMedia =
    activeCategory === "all"
      ? media
      : media.filter((item) => item.category === activeCategory);

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
              {category.charAt(0).toUpperCase() + category.slice(1)}
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
        </div>
      )}
    </div>
  );
};

export default Portfolio;
