const express = require("./node_modules/express");
const bodyparser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
port = process.env.port || 3030;

dotenv.config({
  path: "./.env",
});

const app = express();
const cors = require("cors");
const mysql = require("mysql");

app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);

const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DB,
});

app.use(cookieparser());

app.get("https://sivaprakashblog.onrender.com/", (req, res) => {
  res.send("siva");
});

app.get("https://sivaprakashblog.onrender.com/siva", (req, res) => {
  const obj = {
    name: "siva",
    age: "70",
  };

  res.status(201).send(obj);
});

app.get("https://sivaprakashblog.onrender.com/checkcook", (req, res) => {
  const check = req.cookies["siva"];

  if (check) {
    res.send("exists");
  } else {
    res.send("not");
  }
});

app.post("https://sivaprakashblog.onrender.com/regis", (req, res) => {
  const { name, pass, curpass } = req.body;

  con.query("select * from userids where email=?", [name], async (err, row) => {
    if (err) console.log(err);
    else if (row.length > 0) {
      res.send({ msg: "username is already exist!!" });
    } else if (curpass !== pass || !curpass || !pass) {
      res.send({ msg: "enter correct password" });
    } else {
      let hashpassword = await bcrypt.hash(pass, 4);
      con.query(
        "insert into userids(email,pass) value(?,?)",
        [name, hashpassword],
        (err, row) => {
          if (err) {
            console.log(err);
          }
          res.send({ msg: "saved", ele: name });
        }
      );
    }
  });
});

app.post("https://sivaprakashblog.onrender.com/logdata", (req, res) => {
  const { name, pass } = req.body;

  con.query(
    "select * from userids where email=?",
    [name],
    async (err, rows) => {
      if (err) {
        console.log(err);
      } else if (rows.length <= 0) {
        res.send("error");
      } else if (!(await bcrypt.compare(pass, rows[0].pass))) {
        res.send("error");
      } else {
        const id = rows[0].id;
        const token = jwt.sign({ id: id }, process.env.SECRET, {
          expiresIn: "90d",
        });

        const cookopt = {
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        };
        res.cookie("siva", token, cookopt);

        res.send("success");
        // const decode = jwt.verify(req.cookies.siva, process.env.SECRET);
        // con.query(
        //   "select * from userids where id=?",
        //   [decode.id],
        //   (err, rows) => {
        //     if (err) {
        //       console.log(err);
        //     } else {
        //       res.send(rows);
        //     }
        //   }
        // );
      }
    }
  );
});

app.get("https://sivaprakashblog.onrender.com/getavatar/:id", (req, res) => {
  const { id } = req.params;

  con.query("select avatar from avatars where user_id=?", [id], (err, row) => {
    if (err) console.log(err);

    res.send(row);
  });
});

app.get("https://sivaprakashblog.onrender.com/homedata", async (req, res) => {
  const data = req.cookies;
  if (data) {
    const decode = await jwt.verify(req.cookies.siva, process.env.SECRET);
    con.query("select * from avatars where id=?", [decode.id], (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        res.send(rows);
      }
    });
  } else {
    res.send("error");
  }
});
function siva(req, res, next) {}

app.get(
  "https://sivaprakashblog.onrender.com/removecookie",
  async (req, res) => {
    res.cookie("siva", "logout", {
      expires: new Date(0),
      httpOnly: true,
    });
    res.send("removed");
  }
);

app.get("https://sivaprakashblog.onrender.com/alldata", (req, res) => {
  con.query("select * from usercontents", (err, rows) => {
    if (err) console.log(err);
    else {
      res.send(rows);
    }
  });
});

app.get("https://sivaprakashblog.onrender.com/userid", (req, res) => {
  const decode = jwt.verify(req.cookies.siva, process.env.SECRET);
  res.send(decode);
});

app.post("https://sivaprakashblog.onrender.com/setdata", (req, res) => {
  const { titleval, describe } = req.body;

  const id = jwt.verify(req.cookies.siva, process.env.SECRET);
  con.query("select id,email from userids where id=?", [id.id], (err, rows) => {
    if (err) console.log(err);
    con.query(
      "select avatar from avatars where user_id=?",
      [rows[0].id],
      (err, result) => {
        con.query(
          "insert into usercontents(authorname,title,describetion,user_id,likecount,avatar) values(?,?,?,?,?,?)",
          [rows[0].email, titleval, describe, rows[0].id, 0, result[0].avatar],
          (err, result) => {
            if (err) console.log(err);
            res.send("added");
          }
        );
      }
    );
  });
});

app.get("https://sivaprakashblog.onrender.com/iddata", (req, res) => {
  const id = jwt.verify(req.cookies.siva, process.env.SECRET);

  con.query(
    "select * from usercontents where user_id=?",
    [id.id],
    (err, rows) => {
      if (err) console.log(err);

      res.send(rows);
    }
  );
});
app.get("https://sivaprakashblog.onrender.com/userdata", (req, res) => {
  const id = jwt.verify(req.cookies.siva, process.env.SECRET);

  con.query("select * from avatars where user_id=?", [id.id], (err, rows) => {
    if (err) console.log(err);

    res.send(rows);
  });
});
app.get("https://sivaprakashblog.onrender.com/updatedataid/:id", (req, res) => {
  const { id } = req.params;
  con.query("select * from usercontents where id=?", [id], (err, rows) => {
    if (err) console.log(err);

    res.send(rows);
  });
});

app.post(
  "https://sivaprakashblog.onrender.com/updatedataid/:id",
  (req, res) => {
    const { id } = req.params;
    const { title, describe } = req.body;
    con.query(
      "update usercontents set title=?,describetion=? where id=?",
      [title, describe, id],
      (err, rows) => {
        if (err) console.log(err);

        res.send("updated");
      }
    );
  }
);
app.post("https://sivaprakashblog.onrender.com/updateusername", (req, res) => {
  const { username } = req.body;
  const status = jwt.verify(req.cookies.siva, process.env.SECRET);

  con.query(
    "update usercontents set authorname=? where user_id=?",
    [username, status.id],
    (err, rows) => {
      if (err) console.log(err);

      con.query(
        "update avatars set username=? where user_id=?",
        [username, status.id],
        (err, row) => {
          if (err) console.log(err);

          res.send("update");
        }
      );
    }
  );
});

app.post("https://sivaprakashblog.onrender.com/increcount/:id", (req, res) => {
  const { id } = req.params;
  const userid = jwt.verify(req.cookies.siva, process.env.SECRET);
  const { count } = req.body;
  con.query(
    "update usercontents set likecount=? where id=?",
    [count, id],
    (err, rows) => {
      if (err) console.log(err);
      con.query(
        "insert into likestatus(contentid,user_id) values(?,?)",
        [id, userid.id],
        (err, row) => {
          if (err) console.log(err);
          res.send("updated");
        }
      );
    }
  );
});
app.post("https://sivaprakashblog.onrender.com/decrecount/:id", (req, res) => {
  const { id } = req.params;
  const userid = jwt.verify(req.cookies.siva, process.env.SECRET);
  const { count } = req.body;
  con.query(
    "update usercontents set likecount=? where id=?",
    [count, id],
    (err, rows) => {
      if (err) console.log(err);
      con.query(
        "delete from likestatus where contentid=? and user_id=?",
        [id, userid.id],
        (err, row) => {
          if (err) console.log(err);
          res.send("deleted");
        }
      );
    }
  );
});

app.get("https://sivaprakashblog.onrender.com/likersdata", async (req, res) => {
  const id = await jwt.verify(req.cookies.siva, process.env.SECRET);
  try {
    con.query(
      "select contentid,user_id from likestatus where user_id=?",
      [id.id],
      (err, rows) => {
        res.send(rows);
      }
    );
  } catch (e) {
    res.status(400).send({
      msg: "error",
    });
  }
});

app.get(
  "https://sivaprakashblog.onrender.com/insertavatar/:name",
  (req, res) => {
    const { name } = req.params;
    con.query("select id from userids where email=?", [name], (err, row) => {
      if (err) console.log(err);

      con.query(
        "insert into avatars(avatar,user_id,username) value(?,?,?)",
        ["img1.png", row[0].id, name],
        (err, row) => {
          if (err) console.log(err);
        }
      );
    });
  }
);
app.get("https://sivaprakashblog.onrender.com/deletedata/:id", (req, res) => {
  const { id } = req.params;

  con.query("delete from usercontents where id=?", [id], (err, row) => {
    if (err) console.log(err);

    res.send("success");
  });
});

app.post("https://sivaprakashblog.onrender.com/updateimg", (req, res) => {
  const { img } = req.body;
  const id = jwt.verify(req.cookies.siva, process.env.SECRET);
  con.query(
    "update avatars set avatar=? where user_id=?",
    [img, id.id],
    (err, row) => {
      if (err) {
        console.log(err);
      } else {
        con.query(
          "update usercontents set avatar=? where user_id=?",
          [img, id.id],
          (err, rows) => {
            if (err) {
              console.log(err);
            }
            console.log("updated");
          }
        );
      }
    }
  );
});

app.listen(port, () => {
  console.log(port);
});
