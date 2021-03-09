class Details {
  constructor() {
    this.getHTMLElements();
    this.createEvents();
    this.init();
  }

  getHTMLElements() {
    this.selDetails = document.querySelector(".selected-guest");
    this.itemsDiv = document.querySelector(".items");
    this.detailsDiv = document.querySelector(".item");
    this.itemsList = document.querySelector(".list");
    this.flowBtn = document.querySelector(".flowbtn");
    this.header1 = document.getElementsByClassName("group-name")[0];
    this.header2 = document.getElementsByClassName("group-name")[1];
    this.selectedItem = null;
  }

  createEvents() {
    this.flowBtn.addEventListener("click", () => {
      this.itemsDiv.style.display = "flex";
      this.detailsDiv.style.display = "none";
      this.flowBtn.classList.remove("show");
    });
  }

  init() {
    var url = new URL(window.location.href);
    // TODO below line not working in some browser as the 'grp' value not getting
    //var params = new URLSearchParams(url.search);
    //this.groupID = params.get("grp");
    //this.groupType = params.get("type");

    var params = this.getParams(url);

    this.groupID = params.grp;
    this.groupType = params.type;
    this.groupData = null;
    this.GetDetails(this.CreateDashItems);
  }

  CreateDashItems(self, data) {
    self.itemsList.innerHTML = "";
    self.groupData = data;
    data.details.map((group, index) =>
      self.itemsList.appendChild(self.DetailsTemplate(group, index + 1))
    );
    self.header1.classList.add(MyLang.GetCurrent());
    let grpName = self.GetGroupName(self.groupType);
    self.header1.setAttribute("data-ml", `${grpName.ml}: ${data.names.MNAME}`);
    self.header1.setAttribute("data-en", `${grpName.en}: ${data.names.ENAME}`);
    let dv = document.createElement("div");
    dv.innerHTML = MyLang.GetCountHTML(data.details.length);
    self.header1.appendChild(dv);
  }

  GetGroupName(groupid) {
    switch (groupid) {
      case "1":
        return MyLang.GetLang("DIS");
      case "2":
        return MyLang.GetLang("CIT");
      case "3":
        return MyLang.GetLang("PLA");
      case "4":
        return MyLang.GetLang("LOC");
    }
    return MyLang.GetLang("GUS");
  }

  GetDetails(callback) {
    var self = this;
    this.itemsList.innerHTML = "Loading";
    return fetch(`/details/${this.groupID}/${this.groupType}`)
      .then(response => response.json())
      .then(data => callback(self, data));
  }

  ShowDetails(list, id) {
    if (this.selectedItem != null) this.selectedItem.classList.remove("active");
    if (window.innerWidth <= 550) {
      this.itemsDiv.style.display = "none";
      this.detailsDiv.style.display = "flex";
      this.flowBtn.classList.add("show");
    }
    this.selectedItem = list;
    this.selectedItem.classList.add("active");
    const selDetail = this.groupData.details.find(detail => detail.ID == id);
    this.selDetails.innerHTML = this.Card(selDetail);
    this.selDetails.firstChild.children[0].addEventListener("click", e => {
      this.PlayVideo(e, selDetail.LINK);
    });
  }

  DetailsTemplate(detail, index) {
    let dv = document.createElement("div");
    dv.innerHTML = `<li class="list-item">
	<div class="icon">
		<p class="circle">${index}</p>
	</div>
  <div class="info">
  ${this.GetBasedOnCurrentGroup(detail)}
    <span class="count">${moment(detail.CDATE).fromNow()}</span>
</div>
</li>`;
    let lst = dv.firstChild;
    lst.addEventListener("click", e => {
      this.ShowDetails(e.target, detail.ID);
    });
    return lst;
  }

  //If the selected group is not Guests, then show the Guest name as main info title
  //Based on the Current Group get the Info
  GetBasedOnCurrentGroup(detail) {
    let info = {};
    //default values
    info.en1 = this.groupType == "0" ? detail.P_ENAME : detail.G_ENAME;
    info.ml1 = this.groupType == "0" ? detail.P_MNAME : detail.G_MNAME;
    info.en2 = this.groupType == "2" ? detail.P_ENAME : detail.C_ENAME;
    info.ml2 = this.groupType == "2" ? detail.P_MNAME : detail.C_MNAME;
    info.en3 = this.groupType == "1" ? detail.D_ENAME : detail.P_ENAME;
    info.ml3 = this.groupType == "1" ? detail.D_MNAME : detail.P_MNAME;
    return this.GetDetailsContentInfoHTML(info);
  }

  GetDetailsContentInfoHTML(info) {
    return `<div class="content">
		<span class="title lang ${MyLang.GetCurrent()}" data-en="${
      info.en1
    }" data-ml="${info.ml1}"></span>
		<span class="extra lang ${MyLang.GetCurrent()}" data-en="${info.en2}, ${
      info.en3
    }" data-ml="${info.ml2}, ${info.ml3}"></span>
	</div>`;
  }

  PlayVideo(event, link) {
    event.target.innerHTML = `<iframe style="height:100%;width:100%" src="https://www.youtube.com/embed/${link}">n</iframe> `;
  }

  Card(guest) {
    //console.log(guest)
    return `<div class="card">
          <div class="video" style="background-image:url(${this.Getyoutubeimg(
            guest.LINK
          )})" >
          <span class="play"><i class="fab fa-youtube"></i></span>
          </div>
        <div class="card-content">
        <div class="sub"> 
          ${this.CardContent("DIS", guest.D_ENAME, guest.D_MNAME)}
          ${this.CardContent("CIT", guest.C_ENAME, guest.C_MNAME)}
          ${this.CardContent("PLA", guest.P_ENAME, guest.P_MNAME)}
        </div>
        <div class="sub"> 
          ${this.CardContent(
            "GEN",
            this.GenderText(guest.GENDER),
            this.GenderText(guest.GENDER, false)
          )}
          ${this.CardContent(
            "SIZ",
            this.SizeText(guest.CSIZE),
            this.SizeText(guest.CSIZE, false)
          )}
          ${this.CardContent("LEN", "No Information", "വിവരങ്ങൾ ലഭ്യമല്ല")}
        </div>   
        </div>
      </div>`;
  }

  GenderText(gender, isEng = true) {
    if (gender == 1) return isEng ? "Male" : "ആൺ";
    else if (gender == 2) return isEng ? "Female" : "പെൺ";
    else return isEng ? "No Information" : "വിവരങ്ങൾ ലഭ്യമല്ല";
  }

  SizeText(size, isEng = true) {
    if (size == 1) return isEng ? "Medium" : "ഇടത്തരം";
    else if (size == 2) return isEng ? "Big" : "വലുത്";
    else return isEng ? "Small" : "ചെറുത്";
  }

  CardContent(key, en, ml) {
    return `<div class="subitems">
      <span class="subhead lang ${MyLang.GetCurrent()}" data-en="${
      MyLang.GetLang(key).en
    }" data-ml="${MyLang.GetLang(key).ml}"></span>
    <span class="card-title lang ${MyLang.GetCurrent()}" data-en="${en}" data-ml="${ml}"> </span>
    </div>`;
  }

  Getyoutubeimg(link) {
    if (link != null) {
      return (
        "https://img.youtube.com/vi/" + link.split("/").pop() + "/default.jpg"
      );
    }
    return "https://cdn.glitch.com/049026c7-e91f-41df-9f56-8172d6d48f44%2Fnoimage.png?v=1608304563192";
  }

  /**
   * Get the URL parameters
   * source: https://css-tricks.com/snippets/javascript/get-url-variables/
   * @param  {String} url The URL
   * @return {Object}     The URL parameters
   */
  getParams(url) {
    var params = {};
    var parser = document.createElement("a");
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  }
}

window.addEventListener("load", e => {
  new Details();
});
