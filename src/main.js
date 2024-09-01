const myMap = new MapModel({
  target: "map",
  defaultZoom: 6,
  view: {
    center: [35, 39],
    zoom: 6,
  },
  openFormPanel: openFeatureForm,
});

async function renderPage() {
  await fetchFeatureData();
  const featureList = FeatureStore.getFeatureList();
  myMap.renderMap(featureList);
}

async function fetchFeatureData() {
  await ApiHelper.requestHandler(async () => {
    const result = await FeatureService.getAllFeatures();
    FeatureStore.setFeatureList(result.data);
  }, "Error fetching feature data.");
}

async function createFeature(feature) {
  await ApiHelper.requestHandler(async () => {
    const result = await FeatureService.createFeature(feature);
    if (result.success) {
      ModalHelper.showSuccessMessage(result.message);
    }
    console.log(result);
  }, "Error creating feature.");
}

async function updateFeature(id, feature) {
  await ApiHelper.requestHandler(async () => {
    const result = await FeatureService.updateFeature(id, feature);
    if (result.success) {
      ModalHelper.showSuccessMessage(result.message);
    }
    console.log(result);
  }, "Error update feature.");
}

async function deleteFeature(id) {
  await ApiHelper.requestHandler(async () => {
    const result = await FeatureService.deleteFeature(id);
    if (result.success) {
      ModalHelper.showSuccessMessage(result.message);
    }

    console.log(result);
  }, "Error delete feature.");
}

async function handleSave() {
  const formData = ModalHelper.getFeatureFormData();

  resetAddMode();
  await createFeature(formData);
  await renderPage();
}

async function handleUpdate() {
  const formData = ModalHelper.getFeatureFormData();

  await updateFeature(FeatureStore.getFeature().id, formData);
  resetAddMode();
  await renderPage();
}

async function handleDelete(id) {
  MapHelper.disposePopover(myMap);
  await deleteFeature(id);
  await renderPage();
}

async function handleClickUpdateBtn(id) {
  MapHelper.disposePopover(myMap);
  const feature = FeatureStore.getFeatureList().find((e) => e.id == id);

  if (feature) {
    FeatureStore.setFeature(feature);

    handleUpdateSelect();
    openFeatureForm({ mode: "update", feature });
  }
}

async function handleUpdateSelect() {
  const feature = FeatureStore.getFeature();
  const olFeature = MapHelper.getMapFeatureById(myMap, feature.id);
  if (olFeature) {
    MapHelper.getMapFeatures(myMap).forEach((feature) => {
      if (feature !== olFeature) {
        MapHelper.disableFeature(myMap, feature);
      } else {
        MapHelper.setFeatureSelected(myMap, feature);
      }
    });

    myMap.addedFeature = olFeature;
    MapHelper.createTranslateInteraction(myMap, olFeature);
    MapHelper.createModifyInteraction(myMap, olFeature);
  }
}

async function handleClickShowBtn(id) {
  const features = MapHelper.getMapFeatures(myMap);
  const feature = features.find((e) => e.get("data").id == id);

  if (feature) {
    const coordinate = MapHelper.getWktCoordinates(feature.get("data").wkt);

    MapHelper.zoomToFeature({
      mapModel: myMap,
      feature,
      duration: 2000,
      cb: () => {
        MapHelper.showFeaturePopover({ mapModel: myMap, feature, coordinate });
      },
    });
  }
}

function openFormPanel(feature) {
  try {
    // ModalHelper.createPointFormPanel("Add New Point", { feature }, handleSave);
    ModalHelper.openFeatureForm({
      title: "Add New Feature",
      feature,
      onSubmit: () => handleSave,
    });
  } catch (error) {
    ApiHelper.handleError(error, "Error opening feature form panel.");
  }
}

function openFeatureForm({ mode = "new", feature }) {
  try {
    if (mode == "new") {
      ModalHelper.openFeatureForm({
        title: "Add Feature",
        feature,
        onSubmit: handleSave,
        onCancel: resetAddMode,
      });
    } else {
      ModalHelper.openFeatureForm({
        title: "Update Feature",
        feature,
        onSubmit: handleUpdate,
        onCancel: () => {
          renderPage();
          resetAddMode();
        },
      });
    }
  } catch (error) {
    ApiHelper.handleError(error, "Error opening feature form panel.");
  }
}

function openQueryPanel() {
  try {
    ModalHelper.createQueryTablePanel(
      FeatureStore.getFeatureList(),
      handleDelete,
      handleClickUpdateBtn,
      handleClickShowBtn
    );
  } catch (error) {
    ApiHelper.handleError(error, "Error opening query panel.");
  }
}

function handleClickAddBtn() {
  myMap.addMode ? resetAddMode() : ModalHelper.openFeatureTypeSelector();
}

function activateAddMode(drawType) {
  myMap.addMode = true;
  DOMHelper.changeCursorType("crosshair");
  addFeatureBtn.classList.add("active");
  addFeatureToast.classList.add("active");
  MapHelper.createDrawInteraction(myMap, drawType);
}

function resetAddMode() {
  myMap.addMode = false;
  DOMHelper.changeCursorType("default");
  addFeatureBtn.classList.remove("active");
  addFeatureToast.classList.remove("active");
  ModalHelper.closeFeatureForm();

  MapHelper.removeInteraction(myMap, myMap.draw);
  MapHelper.removeInteraction(myMap, myMap.translate);
  MapHelper.removeInteraction(myMap, myMap.modify);

  myMap.vectorSource.removeFeature(myMap.addedFeature);
  myMap.addedFeature = null;
  myMap.draw = null;
  myMap.translate = null;
  myMap.modify = null;
}

renderPage();
