class MapHelper {
  static addFeatures(mapModel, featureList) {
    featureList.forEach((feature) => MapHelper.addWktToMap(mapModel, feature));
  }

  static addWktToMap(mapModel, feature) {
    const wktFormat = new ol.format.WKT();

    // WKT verisini bir ol.Feature nesnesine dönüştürün
    const olFeature = wktFormat.readFeature(feature.wkt, {
      featureProjection: "EPSG:3857",
    });
    olFeature.set("clickable", true);

    // Geometrinin türünü öğrenin
    const type = olFeature.getGeometry().getType();

    if (type == "Point") {
      olFeature.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            anchorXUnits: "fraction",
            anchorYUnits: "fraction",
            src: "../../public/medias/map-pointer.png",
            scale: 0.06,
          }),
        })
      );
    }

    olFeature.setProperties({ data: feature });

    // Feature'ı harita kaynağına ekleyin
    mapModel.vectorSource.addFeature(olFeature);
  }

  static removeInteraction(mapModel, interaction) {
    mapModel.map.removeInteraction(interaction);
  }
  static createDrawInteraction(mapModel, drawType) {
    mapModel.draw = new ol.interaction.Draw({
      source: mapModel.vectorSource,
      type: drawType,
    });
    mapModel.map.addInteraction(mapModel.draw);

    mapModel.draw.on("drawend", mapModel.handleDrawEnd.bind(mapModel));

    mapModel.snap = new ol.interaction.Snap({ source: mapModel.vectorSource });
    mapModel.map.addInteraction(mapModel.snap);
  }

  static createTranslateInteraction(mapModel, olFeature) {
    mapModel.translate = new ol.interaction.Translate({
      features: new ol.Collection([olFeature]),
    });

    mapModel.map.addInteraction(mapModel.translate);
    mapModel.translate.on(
      "translateend",
      mapModel.handleTranslateEnd.bind(mapModel)
    );
  }

  static createModifyInteraction(mapModel, olFeature) {
    mapModel.modify = new ol.interaction.Modify({
      features: new ol.Collection([olFeature]),
    });
    mapModel.map.addInteraction(mapModel.modify);
    mapModel.modify.on("modifyend", mapModel.handleModifyEnd.bind(mapModel));
  }

  static createSelectInteraction(mapModel, olFeature) {
    mapModel.modify = new ol.interaction.Modify({
      features: new ol.Collection([olFeature]),
    });
    mapModel.map.addInteraction(mapModel.modify);
    mapModel.modify.on("modifyend", mapModel.handleModifyEnd.bind(mapModel));

    mapModel.select = new ol.interaction.Select({
      features: new ol.Collection([olFeature]),
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "blue",
          width: 3,
        }),
        fill: new ol.style.Fill({
          color: "rgba(0, 0, 255, 0.1)",
        }),
      }),
    });

    mapModel.map.addInteraction(mapModel.select);
  }

  static setFeatureSelected(mapModel, olFeature) {
    const type = olFeature.getGeometry().getType();

    if (type == "Point") {
      olFeature.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            anchorXUnits: "fraction",
            anchorYUnits: "fraction",
            src: "../../public/medias/map-pointer.png",
            scale: 0.06,
          }),
        })
      );
    } else {
      olFeature.setStyle(
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: "blue",
            width: 3,
          }),
          fill: new ol.style.Fill({
            color: "rgba(0, 0, 255, 0.1)",
          }),
        })
      );
    }
  }

  static disableFeature(mapModel, olFeature) {
    olFeature.set("clickable", false);
    const type = olFeature.getGeometry().getType();

    if (type == "Point") {
      olFeature.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            anchorXUnits: "fraction",
            anchorYUnits: "fraction",
            src: "../../public/medias/map-pointer-black.png",
            scale: 0.06,
          }),
        })
      );
    } else {
      olFeature.setStyle(
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: "rgba(0, 0, 0, 0.2)",
            width: 1,
          }),
          fill: new ol.style.Fill({
            color: "rgba(0, 0, 0, 0.2)",
          }),
        })
      );
    }
  }

  static getMapFeatures(mapModel) {
    const features = mapModel.vectorLayer.getSource().getFeatures();
    return features;
  }

  static getMapFeatureById(mapModel, id) {
    const features = this.getMapFeatures(mapModel);
    return features.find((feature) => feature.get("data").id == id);
  }

  static getWktCoordinates(wkt) {
    const wktFormat = new ol.format.WKT();

    // WKT verisini bir ol.Feature nesnesine dönüştürün
    const feature = wktFormat.readFeature(wkt, {
      featureProjection: "EPSG:3857",
    });

    // Geometrinin türünü öğrenin
    const coords = feature.getGeometry().getCoordinates();
    return coords;
  }

  static getFeatureData(feature) {
    return feature.get("data");
  }

  static getFeatureCoordinates(feature) {
    return feature.getGeometry().getCoordinates();
  }

  static formatFeature(wkt) {
    const format = new ol.format.WKT();

    const feature = format.readFeature(wkt, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });

    return feature;
  }

  static getFeatureAtPixel(mapModel, pixel) {
    return mapModel.map.forEachFeatureAtPixel(pixel, (feature) => feature);
  }

  static createMapPointPopup(feature) {
    return `
      <div class="popup-header">
        <span class="popup-title" id="popupTitle">${feature.name}</span>
        <span class="close-btn">×</span>
      </div>
      <div class="popup-body">
        <p>WKT: <span id="popupX">${feature.wkt}</span></p>
        <td>
          <button type="button" class="btn btn-warning point-update-btn" onclick="handleClickUpdateBtn(
            ${feature.id}
          )">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button type="button" class="btn btn-danger point-delete-btn" onclick="handleDelete(
            ${feature.id}
          )">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          </td>
      </div>
    `;
  }

  static showFeaturePopover({ mapModel, feature, coordinate }) {
    this.disposePopover(mapModel);
    const data = this.getFeatureData(feature);

    const popupElement = mapModel.overlay.getElement();

    mapModel.overlay.setPosition(coordinate);
    popupElement.innerHTML = this.createMapPointPopup(data);
    popupElement.classList.add("show");

    popupElement.querySelector(".close-btn").onclick = () =>
      this.disposePopover(mapModel);
  }

  static disposePopover(mapModel) {
    const popupElement = mapModel.overlay.getElement();
    if (popupElement) {
      popupElement.classList.remove("show");
    }
  }

  static zoomToFeature({ mapModel, feature, duration, cb }) {
    this.disposePopover(mapModel);
    const extent = feature.getGeometry().getExtent();

    mapModel.map.getView().fit(extent, {
      size: mapModel.map.getSize(),
      maxZoom: 16,
      duration: duration,
    });

    mapModel.map.getView().animate(
      {
        center: ol.extent.getCenter(extent),
        zoom: mapModel.map.getView().getZoom(),
        duration: duration,
      },
      cb
    );
  }
}
