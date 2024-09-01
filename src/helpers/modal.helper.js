class ModalHelper {
  static createSwalPanel({ config, onConfirm, onCancel }) {
    Swal.fire(config).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm();
      } else if (!result.isConfirmed && onCancel) {
        onCancel();
      }
    });
  }

  static createQueryTablePanel(featureList, onDelete, onUpdate, onShow) {
    const columnDefs = [
      {
        headerName: "Name",
        field: "name",
        flex: 2,
        minWidth: 200,
        cellStyle: { display: "flex", "align-items": "center" },
      },
      {
        headerName: "WKT",
        field: "wkt",
        flex: 2,
        minWidth: 400,
        cellStyle: { display: "flex", "align-items": "center" },
        valueFormatter: (p) => MapHelper.getWktCoordinates(p.value),
      },
      {
        headerName: "Actions",
        flex: 1,
        maxWidth: 200,
        cellStyle: { display: "flex", "align-items": "center" },
        filter: false,
        cellRenderer: (params) => {
          const { id } = params.data;

          const showButton = DOMHelper.createIconButton({
            buttonClass: "btn-primary",
            iconClass: "fa-solid fa-eye",
            featureId: id,
            onClick: () => {
              Swal.close();
              onShow(id);
            },
          });

          const updateButton = DOMHelper.createIconButton({
            buttonClass: "btn-warning mx-2",
            iconClass: "fa-solid fa-pen",
            featureId: id,
            onClick: () => {
              Swal.close();
              onUpdate(id);
            },
          });

          const deleteButton = DOMHelper.createIconButton({
            buttonClass: "btn-danger",
            iconClass: "fa-solid fa-trash-can",
            featureId: id,
            onClick: () => {
              Swal.close();
              onDelete(id);
            },
          });

          const container = document.createElement("div");
          container.append(showButton, updateButton, deleteButton);

          return container;
        },
      },
    ];

    const rowData = featureList;

    const gridOptions = {
      columnDefs: columnDefs,
      rowData: rowData,
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      alwaysShowHorizontalScroll: true,
      domLayout: "autoHeight",
      rowHeight: 60,
      autoSizePadding: 20,
      defaultColDef: {
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
    };

    const tableEl = document.createElement("div");
    tableEl.id = "myGrid";
    tableEl.classList.add("ag-theme-alpine");
    agGrid.createGrid(tableEl, gridOptions);

    const config = {
      title: "Feature List",
      html: tableEl,
      showConfirmButton: false,
      showCloseButton: true,
      width: "90%",
    };

    this.createSwalPanel({ config });
  }

  static openFeatureForm({ title, feature, onSubmit, onCancel }) {
    const formFields = [
      {
        labelText: "Name",
        inputName: "name",
        inputValue: feature.name,
        readonly: false,
      },
      {
        labelText: "WKT",
        inputName: "wkt",
        inputValue: feature.wkt,
        readonly: true,
      },
    ];
    const formButtons = [
      {
        buttonClass: "mb-3 btn btn-block btn-primary",
        text: "Submit",
        featureId: feature.id,
        onClick: onSubmit,
      },
      {
        buttonClass: "btn btn-block btn-danger",
        text: "Cancel",
        featureId: feature.id,
        onClick: onCancel,
      },
    ];
    const formEl = DOMHelper.createFormElement({
      elementId: "featureForm",
      fields: formFields,
      buttons: formButtons,
    });

    DOMHelper.createFeatureFormCanvas({ title, body: formEl });
  }

  static closeFeatureForm() {
    document.getElementById("featureFormOffcanvas").classList.remove("show");
  }

  static getFeatureFormData() {
    const featureForm = document.getElementById("featureForm");
    return new Feature(
      featureForm.querySelector("#name").value,
      featureForm.querySelector("#wkt").value
    );
  }

  static openFeatureTypeSelector() {
    Swal.fire({
      html: Template.featureTypeSelector,
      width: "max-content",
      showConfirmButton: false,
      showCloseButton: true,
      padding: "0",
      backdrop: "transparent",
      position: "top",
      didOpen: (swal) => {
        swal.querySelectorAll(".type-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            activateAddMode(btn.getAttribute("data-feature-type"));
            Swal.close();
          });
        });
      },
    });
  }

  static showSuccessMessage(message) {
    this.createSwalPanel({
      config: {
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        icon: "success",
        text: message,
      },
    });
  }
}
