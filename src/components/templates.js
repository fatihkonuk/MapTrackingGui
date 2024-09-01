class Template {
  static featureTypeSelector = `
      <div class="px-5 text-center">
        <div class="mb-3 fs-4">Select a type</div>
        <div class="flex justify-center items-center gap-5 mb-3">
          <div>
            <button type="button" class="mb-2 btn btn-primary btn-md btn-block type-btn" data-feature-type="Point">
              <i class="fa-solid fa-location-dot"></i>
            </button>
            <span>Point</span>
          </div>
          <div>
            <button type="button" class="mb-2 btn btn-warning btn-md btn-block type-btn" data-feature-type="LineString">
              <i class="fa-solid fa-arrow-trend-up"></i>
            </button>
            <span>Line</span>
          </div>
          <div>
            <button type="button" class="mb-2 btn btn-danger btn-md btn-block type-btn" data-feature-type="Polygon">
              <i class="fa-solid fa-draw-polygon"></i>
            </button>
            <span>Polygon</span>
          </div>
        </div>
      </div>
    `;

  static featureUpdateSelector = `
      <div class="px-5 text-center">
        <div class="mb-3 fs-4">Select a type</div>
        <div class="flex justify-center items-center gap-5 mb-3">
          <div>
            <button type="button" class="mb-2 btn btn-primary btn-md btn-block type-btn" data-type="auto">
              <i class="fa-solid fa-location-dot"></i>
            </button>
            <span>Auto</span>
          </div>
          <div>
            <button type="button" class="mb-2 btn btn-warning btn-md btn-block type-btn" data-type="manuel">
              <i class="fa-solid fa-arrow-trend-up"></i>
            </button>
            <span>Manuel</span>
          </div>
          
      </div>
    `;

  static featureFormOffcanvas = `
    <div
      class="offcanvas offcanvas-start bg-light show"
      id="featureFormOffcanvas"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title"></h5>
        <button class="btn-close" id="offcanvasClose">&times;</button>
      </div>
      <div class="offcanvas-body"></div>
    </div>
    `;
}
