const langEn = "lang-en";
const langMl = "lang-ml";
const langkey = "myLang";

//by default the HTML class lang is set to English, change this if any change
const defaultLang = langEn;

class MyLang {
  static langs() {
    return {
      GUS: { en: "Guests", ml: "അതിഥികൾ" },
      DIS: { en: "District", ml: "ജില്ല" },
      CIT: { en: "City", ml: "നഗരം" },
      PLA: { en: "Place", ml: "സ്ഥലം" },
      LOC: { en: "Location", ml: "പ്രദേശം" },
      GEN: { en: "Gender", ml: "ലിംഗഭേദം" },
      SIZ: { en: "Size", ml: "വലുപ്പം" },
      LEN: { en: "Length", ml: "നീളം" }
    };
  }

  static GetLang(id) {
    return this.langs()[id];
  }

  static GetCurrent() {
    let userLang = localStorage.getItem(langkey);
    if (!userLang) {
      localStorage.setItem(langkey, defaultLang);
      return defaultLang;
    }
    return userLang;
  }

  static GetNew() {
    return this.GetCurrent() === langEn ? langMl : langEn;
  }
  
  //Component creation for Count Data
  static GetCountHTML(count){
    return `<div class="countInfo">
      <span class="count"> ${count}</span> 
      <span class="lang ${this.GetCurrent()}" data-en="${this.GetLang('GUS').en}" data-ml="${this.GetLang('GUS').ml}"></span>
    </div>`
  }
  
}

//call for page load if not present
MyLang.GetCurrent();

function ChangeLang() {
  let newLang = MyLang.GetNew();
  var titles = Array.from(document.getElementsByClassName("lang"));
  if (titles) {
    //check replace is available in browser
    let hasreplace = typeof titles[0].classList.replace === "function";

    titles.map(title => {
      if (hasreplace) title.classList.replace(MyLang.GetCurrent(), newLang);
      else {
        title.classList.remove(MyLang.GetCurrent());
        title.classList.add(newLang);
      }
    });
    localStorage.setItem(langkey, newLang);
  }
}

window.addEventListener("load", e => {
  document.getElementById("langBtn").classList.add(MyLang.GetCurrent());
});
