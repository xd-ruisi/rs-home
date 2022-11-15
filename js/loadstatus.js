function getTimezoneString() {
  const offset = new Date().getTimezoneOffset() / -60;
  if (offset === 0) return "UTC";
  return Math.sign(offset) === -1 ? `UTC ${offset}` : `UTC +${offset}`;
}

$(document).ready(function () {
  $.getJSON("/mirrors/status.json", function (jsondata) {
    $("#status-table").append(`
      <thead class="table-dark">
        <tr class="row">
          <th class="col-6">Name</th>
          <th class="col-6">Last Update (${getTimezoneString()})</th>
        </tr>
      </thead>
    `);
    $("#status-table").append("<tbody>");
    for (let data of jsondata.mirrors) {
      let name = data.cname;
      let path = data.url;
      let help = data.help;
      let lastUpdate = new Date(parseInt(data.status.slice(1)) * 1000);
      if (lastUpdate instanceof Date && !isNaN(lastUpdate)) {
        lastUpdate = lastUpdate.toLocaleString();
      }
      let trClass = "table-danger";
      let statusLabel = "";
      if (data.status.startsWith("Y")) {
        trClass = "table-info";
        statusLabel = '<span class="badge text-bg-info">syncing</span>';
      } else if (data.status.startsWith("F")) {
        trClass = "table-warning";
        statusLabel = '<span class="badge text-bg-warning">failed</span>';
      } else if (data.status.startsWith("S")) {
        trClass = "table-light";
        statusLabel = "";
      } else if (data.status.startsWith("R")) {
        trClass = "table-light";
        statusLabel = '<span class="badge text-bg-primary">reverse proxy</span>';
        lastUpdate = "";
      } else if (data.status.startsWith("C")) {
        trClass = "table-light";
        statusLabel = '<span class="badge text-bg-primary">cached</span>';
        lastUpdate = "";
      } else if (data.status.startsWith("P")) {
        trClass = "table-warning";
        statusLabel = '<span class="badge text-bg-warning">paused</span>';
        lastUpdate = "";
      }
      const help_btn = `<a href="${help}" class="text-primary">
        <span class="fas fa-question-circle" aria-hidden="true"></span>
      </a>`;
      $("#status-table").append($(`
        <tr class="row ${trClass}">
        <td id="td-${name}"class="col-6">
          <a href="${jsondata.site.url}${path}" class="text-dark">${name}</a>
          ${(help || "") && help_btn}
        </td>
        <td class="col-6">${lastUpdate}${statusLabel}</td>
        </tr>"
      `));
    };
    $("#status-table").append("</tbody>");
  });
});
