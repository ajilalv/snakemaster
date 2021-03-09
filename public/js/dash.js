class DashBoard {
  constructor() {
    this.getHTMLElements();
    this.menuItems = [];
    ["GUS", "DIS", "CIT", "PLA", "LOC"].forEach((key, index) => {
      this.menuItems.push(Object.assign(MyLang.GetLang(key), { id: index }));
    });
    this.init();
  }

  init() {
    this.groupType = "0";
    this.CreateGroupSelection();
    this.setActiveItem();
    this.CreateGroups();
    this.Events();
  }

  setActiveItem() {
    if (this.currentGroup) this.currentGroup.classList.remove("active");
    this.grpList.children[this.groupType].children[0].classList.add("active");
    this.currentGroup = this.grpList.children[this.groupType].children[0];
  }

  getHTMLElements() {
    this.secItems = document.querySelector(".items");
    this.grpList = document.getElementById("grpList");
    this.grpDrop = document.getElementById("grpDrop");
  }

  Events() {
    this.grpDrop.addEventListener("change", e => {
      this.btnClicked(this.grpDrop.value);
    });
    //as select options cant have(?) ::after
    let btn = document.getElementById("langBtn");
    btn.addEventListener("click", e => {
      Array.from(this.grpDrop.children).forEach(
        node =>
          (node.text = this.isEnglish()
            ? node.getAttribute("data-en")
            : node.getAttribute("data-ml"))
      );
    });
  }

  CreateGroupSelection() {
    this.menuItems.forEach(item => {
      this.grpList.appendChild(this.listItem(item));
      this.grpDrop.innerHTML += `<option value=${item.id} data-en="${
        item.en
      }" data-ml="${item.ml}">
      ${this.isEnglish() ? item.en : item.ml}</option>`;
    });
  }

  isEnglish() {
    return MyLang.GetCurrent().indexOf("en") > 0;
  }

  listItem(item) {
    let div = document.createElement("div");
    div.innerHTML = `<li> <a class="btn lang ${MyLang.GetCurrent()}" data-en="${
      item.en
    }" data-ml="${item.ml}" href="#"></a></li>`;
    let a = div.firstChild.childNodes[1];
    a.addEventListener("click", e => this.btnClicked(item.id));
    return div.firstChild;
  }

  CreateDashItems(self, data) {
    self.secItems.innerHTML = "";
    data.map(group => (self.secItems.innerHTML += self.dashTemplate(group)));
  }

  // not using async/await to support old browser
  GetGroups(callback) {
    var self = this;
    return fetch("/dashboard/" + this.groupType)
      .then(response => response.json())
      .then(data => callback(self, data));
  }

  CreateGroups() {
    this.secItems.innerHTML = "Loading..";
    this.GetGroups(this.CreateDashItems);
  }

  btnClicked(id) {
    this.groupType = id;
    this.setActiveItem();
    this.CreateGroups(this.CreateDashItems);
  }

  dashTemplate(group) {
    return `<a href="/details?grp=${group.ID}&type=${this.groupType}">
	<li class="item">
    <div class="icon">
      <img src="${this.GetImage(group.ID)}">
    </div>
    ${MyLang.GetCountHTML(group.Count)}
    <div class="info">
      <div class="title lang ${MyLang.GetCurrent()}" data-en="${
      group.ENAME
    }" data-ml="${group.MNAME}"></div>
      <span class="extra">Last Caught ${moment(group.Date).fromNow()}</span>
    </div>
	</li>
</a>`;
  }

  GetImage(id) {
    console.log(id);
    switch (id) {
      case 200:
        return "https://cdn.glitch.com/049026c7-e91f-41df-9f56-8172d6d48f44%2F200.jpg?v=1614960681717";
      case 201:
        return "https://cdn.glitch.com/049026c7-e91f-41df-9f56-8172d6d48f44%2F202.jpg?v=1614963198131";
      case 202:
        return "https://cdn.glitch.com/049026c7-e91f-41df-9f56-8172d6d48f44%2F201.jpg?v=1614962180408";
      default:
        return "https://cdn.glitch.com/049026c7-e91f-41df-9f56-8172d6d48f44%2Fnoimage.png?v=1608304563192";
    }
  }
}

window.addEventListener("load", e => {
  new DashBoard();
});
