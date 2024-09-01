class MapModel {
  constructor(config) {
    this.config = config || {};

    this.initVariables();
    this.initVectorLayer();
    this.initOverlay();
  }

  initVariables() {
    this.map = null;
    this.defaultZoom = this.config.view.zoom;
    this.openFormPanel = this.config.openFormPanel;
    this.addMode = false;
    this.draw = null;
    this.snap = null;
    this.addedFeature = null;
  }

  initVectorLayer() {
    this.vectorSource = new ol.source.Vector({ features: [] });
    this.vectorLayer = new ol.layer.Vector({ source: this.vectorSource });
  }

  initOverlay() {
    this.overlay = new ol.Overlay({
      element: document.getElementById("mapFeaturePopup"),
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, 0],
    });
  }

  bindMapEvents() {
    this.map.on("singleclick", this.handleSingleClick.bind(this));
    this.map.on("dblclick", this.handleDoubleClick.bind(this));
    this.map.on("pointermove", this.handlePointerMove.bind(this));
    this.map.on("movestart", this.handleMapMoveStart.bind(this));
  }

  renderMap(features) {
    this.vectorSource.clear();
    MapHelper.addFeatures(this, features);

    if (!this.map) {
      this.createMap();
      this.bindMapEvents();
    }
  }

  createMap() {
    this.map = new ol.Map({
      target: this.config.target || "map",
      layers: [
        new ol.layer.Tile({ source: new ol.source.OSM() }),
        this.vectorLayer,
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat(this.config.view.center || [35, 39]),
        zoom: this.config.view.zoom || 6,
      }),
      overlays: [this.overlay],
    });
  }

  handleSingleClick(event) {
    if (!this.addMode) {
      const feature = MapHelper.getFeatureAtPixel(this, event.pixel);

      if (feature && feature.get("clickable")) {
        const coordinate = event.coordinate;
        MapHelper.showFeaturePopover({ mapModel: this, feature, coordinate });
      }
    }
  }

  handleDoubleClick(event) {
    if (!this.addMode) {
      const feature = this.map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );

      if (feature) {
        event.preventDefault();
        event.stopPropagation();

        MapHelper.zoomToFeature({
          mapModel: this,
          feature,
          duration: 2000,
          cb: () => {
            const coordinate = MapHelper.getWktCoordinates(
              feature.get("data").wkt
            );

            MapHelper.showFeaturePopover({
              mapModel: this,
              feature,
              coordinate,
            });
          },
        });
      }
    }
  }

  handleMapMoveStart(event) {
    MapHelper.disposePopover(this); // Close the popup when the map is moved
  }

  handlePointerMove(event) {
    const feature = MapHelper.getFeatureAtPixel(this, event.pixel);

    if (feature && feature.get("clickable")) {
      DOMHelper.changeCursorType("pointer");
    } else {
      DOMHelper.changeCursorType("default");
    }
  }

  handleModifyEnd(event) {
    const format = new ol.format.WKT();
    const newWkt = format.writeFeature(this.addedFeature, {
      featureProjection: "EPSG:3857",
    });

    const feature = FeatureStore.getFeature();
    feature.wkt = newWkt;
    openFeatureForm({ mode: "update", feature });
  }

  handleTranslateEnd(event) {
    const format = new ol.format.WKT();
    const newWkt = format.writeFeature(this.addedFeature, {
      featureProjection: "EPSG:3857",
    });

    const feature = FeatureStore.getFeature();
    feature.wkt = newWkt;
    openFeatureForm({ mode: "update", feature });
  }

  handleDrawEnd(event) {
    const wktFormat = new ol.format.WKT();

    this.addedFeature = event.feature;

    const feature = event.feature;

    // Geometriyi WKT formatına dönüştürün
    const wkt = wktFormat.writeFeature(feature, {
      featureProjection: "EPSG:3857", // Harita projeksiyonu
    });

    openFeatureForm({ mode: "new", feature: new Feature("", wkt) });

    this.map.removeInteraction(this.draw);
  }
}
