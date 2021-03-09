const driveDb = require("drive-db");
// To sync an existing db with Excel sheet data
class InitDB {
  constructor() {
    const fs = require("fs");
    const dbFile = "./.data/mydbV5.db";
    const dbExists = fs.existsSync(dbFile);

    const sqlite3 = require("sqlite3").verbose();
    this.sqldb = new sqlite3.Database(dbFile);

    this.tablenames = require("./tableHelper.js").tablenames;

    // if the DB file is not exists, then add tables and data
    if (!dbExists) {
      this.sqldb.serialize(() => {
        this.CreateDataTable();
        this.CreateOtherTable(this.tablenames.guests);
        this.CreateOtherTable(this.tablenames.places);
        this.CreateOtherTable(this.tablenames.locations);
        console.log("all Tables created!");
        this.UpdateRawDataFromExcel();
        this.UpdateOtherDataFromExcel("2", this.tablenames.guests);
        this.UpdateOtherDataFromExcel("3", this.tablenames.places);
        this.UpdateOtherDataFromExcel("4", this.tablenames.locations);
      });
    }
    console.log(
      dbExists ? "Existing DB found, ready to go !!" : "New DB Created and sync with Excel !!"
    );
  }

  getDB() {
    return this.sqldb;
  }

  DropAllTables() {
    console.log("drop called");
    for (var index = 0; index <= 3; index++) {
      this.sqldb.run(
        `DROP TABLE IF EXISTS ${Object.values(this.tablenames)[index]}`
      );
    }
  }

  CreateDataTable() {
    this.sqldb
      .run(`CREATE TABLE ${this.tablenames.rawdata} (ID INTEGER PRIMARY KEY, CDATE TEXT,DIS INTEGER,CITY INTEGER, PLACE INTEGER, 
          NAME INTEGER,LOC INTEGER, DESC TEXT,CSIZE INTEGER,SIZE2 TEXT,AGE TEXT,GENDER INTEGER,LINK TEXT,LINKTIME INTEGER,EPZ TEXT)`);
    console.log("main table done", this.tablenames.rawdata);
  }

  CreateOtherTable(tableName) {
    console.log("creating table", tableName);
    this.sqldb.run(
      `CREATE TABLE ${tableName} (ID INTEGER PRIMARY KEY,ENAME TEXT,MNAME TEXT)`
    );
  }

  UpdateRawDataFromExcel() {
    //get Excel data
    this.ReadExcelData("1", guests => {
      guests.forEach(guest => {
        this.sqldb.run(
          `INSERT INTO ${this.tablenames.rawdata} (ID,CDATE,DIS,CITY,PLACE,NAME,LOC,DESC,CSIZE,SIZE2,AGE,GENDER,LINK,LINKTIME,EPZ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          guest.id,
          guest.caughton,
          guest.district,
          guest.city,
          guest.place,
          guest.name,
          guest.location,
          guest.desc,
          guest.size,
          guest.size2,
          guest.age,
          guest.gender,
          guest.linkid,
          guest.linktime,
          guest.episode
        );
      });
    });
    console.log("raw data updated");
  }

  UpdateOtherDataFromExcel(sheetid, tablename) {
    this.ReadExcelData(String(sheetid), data => {
      data.forEach(key => {
        this.sqldb.run(
          `INSERT INTO ${tablename} (ID,ENAME,MNAME) VALUES (?,?,?)`,
          key.id,
          key.en,
          key.ml
        );
      });
    });
  }

  async ReadExcelData(tabid, callback) {
    //console.log("sheet db called for ", tabid);
    //https://docs.google.com/spreadsheets/d/1LIwKmsEYBGSnhiANa4o3Hc9ZIAoENv1mj-oTFzwaoc8/?hl=en
    const data = await driveDb({
      sheet: process.env.EXCEL_SHEET_ID,
      tab: tabid,
      cache: 3600
    });
    callback(data);
  }
}

module.exports = new InitDB().getDB();
