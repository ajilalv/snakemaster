const tableHelper = require("./tableHelper.js");
const db = require("./InitDB.js");

function getGroups(groupid, callback) {
  const tuple = tableHelper.getGroupsColName(groupid);
  const colname = tuple[0];
  db.all(
    `SELECT ${colname} as ID,max(CDATE)Date, COUNT(${colname}) as Count,t2.ENAME,t2.MNAME FROM ${
      tableHelper.tablenames.rawdata
    } t1
      INNER JOIN ${tuple[1]} t2 ON t2.ID = t1.${colname}
      GROUP BY t1.${colname} ORDER BY COUNT DESC `,
    (err, rows) => {
      if (err) callback(null);
      else callback(rows);
    }
  );
}

function getGroupName(grpID, typeID, callback) {
  const colname = tableHelper.getGroupsColName(typeID);
  db.get(`SELECT * FROM ${colname[1]} WHERE ID = ?`, grpID, (err, names) => {
    if (err) callback(null);
    else callback(names);
  });
}

function getGroupDetails(grpID, typeID, callback) {
  const colname = tableHelper.getGroupsColName(typeID)[0];
  db.all(
    `SELECT T1.ID,T1.NAME,T1.CDATE,T1.DESC,T1.CSIZE,T1.SIZE2,T1.AGE,T1.GENDER,T1.LINK,T1.LINKTIME,T1.EPZ,
		T2.ENAME AS D_ENAME,T2.MNAME AS D_MNAME,
		T3.ENAME AS C_ENAME,T3.MNAME AS C_MNAME,
		T4.ENAME AS P_ENAME,T4.MNAME AS P_MNAME,
		T5.ENAME AS L_ENAME,T5.MNAME AS L_MNAME,
    T6.ENAME AS G_ENAME,T6.MNAME AS G_MNAME
      FROM ${tableHelper.tablenames.rawdata} T1
      INNER JOIN ${tableHelper.tablenames.places} T2  ON T1.DIS = T2.ID
      INNER JOIN ${tableHelper.tablenames.places}  T3  ON T1.CITY = T3.ID
      INNER JOIN ${tableHelper.tablenames.places}  T4  ON T1.PLACE = T4.ID
      INNER JOIN ${tableHelper.tablenames.locations} T5 ON T1.LOC = T5.ID
      INNER JOIN ${tableHelper.tablenames.guests} T6 ON T1.NAME = T6.ID
      WHERE T1.${colname} = ? ORDER BY T1.CDATE DESC`,
    grpID,
    (err, rows) => {
      if (err) callback(null);
      else callback(rows);
    }
  );
}

function getGuestDetails(id, callback) {
  db.get(
    `SELECT * FROM ${tableHelper.tablenames.rawdata} WHERE ID=?`,
    id,
    (err, row) => {
      if (err) callback(null);
      else callback(row);
    }
  );
}

module.exports = {
  getGroupDetails: getGroupDetails,
  getGroups: getGroups,
  getGroupName: getGroupName
};
