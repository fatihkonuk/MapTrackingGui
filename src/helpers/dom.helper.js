class DOMHelper {
  static changeCursorType(type) {
    document.body.style.cursor = type;
  }

  static createButton({
    buttonClass = "",
    text = "",
    featureId = "",
    onClick = null,
  }) {
    return this.#createBaseButton({
      buttonClass,
      innerHTML: text,
      dataAttribute: { name: "data-feature-id", value: featureId },
      onClick,
    });
  }

  static createIconButton({
    buttonClass = "",
    iconClass = "",
    featureId = "",
    onClick = null,
  }) {
    const iconHTML = `<i class="${iconClass}"></i>`;
    return this.#createBaseButton({
      buttonClass,
      innerHTML: iconHTML,
      dataAttribute: { name: "data-feature-id", value: featureId },
      onClick,
    });
  }

  static #createBaseButton({
    buttonClass = "",
    innerHTML = "",
    dataAttribute = { name: "", value: "" },
    onClick = null,
  }) {
    const button = document.createElement("button");
    button.className = `btn ${buttonClass}`.trim();
    button.innerHTML = innerHTML;
    button.type = "button";

    if (dataAttribute.name && dataAttribute.value) {
      button.setAttribute(dataAttribute.name, dataAttribute.value);
    }

    if (typeof onClick === "function") {
      button.addEventListener("click", onClick);
    }

    return button;
  }

  static createFormElement({ elementId, fields = [], buttons = [] }) {
    const formEl = document.createElement("form");
    formEl.id = elementId;

    fields.forEach((field) => formEl.appendChild(this.createInputGroup(field)));
    buttons.forEach((button) => formEl.appendChild(this.createButton(button)));

    return formEl;
  }

  static createInputGroup({
    labelText,
    inputName,
    inputValue = "",
    readonly = false,
  }) {
    const html = `
      <div class="form-group">
        <label for="${inputName}">${labelText}</label>
        <input type="text" name="${inputName}" id="${inputName}" multiline value="${inputValue}" ${
      readonly ? "readonly" : ""
    } />
      </div>
    `;

    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");
    formGroup.innerHTML = html;
    return formGroup;
  }

  static createTableRow(data, keys) {
    const cells = keys
      .map((key) => `<td>${data[key] !== undefined ? data[key] : ""}</td>`)
      .join("");

    return `
      <tr>
        ${cells}
        <td>
          <button type="button" class="btn btn-primary feature-show-btn" data-feature-id="${data.id}">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button type="button" class="btn btn-warning feature-update-btn" data-feature-id="${data.id}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button type="button" class="btn btn-danger feature-delete-btn" data-feature-id="${data.id}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  }

  static createTableElement({ id, classList, labelList, keyList, dataList }) {
    const labels = labelList.map((label) => `<th>${label}</th>`).join("");

    const tableHeaders = labels + `<th>Action</th>`;

    const rows = dataList
      .map((data) => this.createTableRow(data, keyList))
      .join("");

    return `
      <table id="${id}" class="${classList}" width="100%">
        <thead>
          <tr>${tableHeaders}</tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  static createFeatureFormCanvas({ title, body }) {
    const offcanvas = document.getElementById("featureFormOffcanvas");
    offcanvas.querySelector(".offcanvas-title").innerHTML = title;
    offcanvas.querySelector(".offcanvas-body").innerHTML = "";
    offcanvas.querySelector(".offcanvas-body").appendChild(body);
    offcanvas.classList.add("show");
  }
}
