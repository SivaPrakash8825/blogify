window.addEventListener("DOMContentLoaded", async () => {
  const vale = await axios.get(
    "https://sivaprakashblog.onrender.com/checkcook",
    {
      withCredentials: true,
    }
  );
  if (vale.data != "exists") {
    window.location = "https://sivaprakashblog.netlify.app/index.html";
  } else {
    setusercontent();
  }
});
const preloader = document.getElementById("preloader");
window.addEventListener("load", () => {
  preloader.style.display = "none";
});
function moveavatarside() {
  const avatar = document.querySelector("#avatar");
  const edit = document.querySelector("#edit");
  const moveavatar = document.querySelector(".avatars");
  const moveedit = document.querySelector(".editcontent");
  if (!avatar.classList.contains("active")) {
    avatar.classList.add("active");
    edit.classList.remove("active");
  }
  moveedit.style.transform = `translateX(${-200}%)`;
  moveavatar.style.transform = `translateX(${0}%)`;
}
function movecontentpage() {
  const avatar = document.querySelector("#avatar");
  const edit = document.querySelector("#edit");
  const moveavatar = document.querySelector(".avatars");
  const moveedit = document.querySelector(".editcontent");
  if (!edit.classList.contains("active")) {
    edit.classList.add("active");
    avatar.classList.remove("active");
  }
  moveedit.style.transform = `translateX(${-100}%)`;
  moveavatar.style.transform = `translateX(${200}%)`;
}

async function onlyfetchiddata() {
  let val = await axios.get("https://sivaprakashblog.onrender.com/iddata", {
    withCredentials: true,
  });
  const dat = val.data;

  return dat;
}
async function onlyfetchusername() {
  let val = await axios.get("https://sivaprakashblog.onrender.com/userdata", {
    withCredentials: true,
  });
  const dat = val.data;

  return dat;
}
async function getuserid() {
  let val = await axios.get("https://sivaprakashblog.onrender.com/userid", {
    withCredentials: true,
  });
  const dat = val.data;

  return dat;
}

async function setprofileavatar() {
  let id = await getuserid();

  let val = await axios.get(
    `https://sivaprakashblog.onrender.com/getavatar/${id.id}`
  );
  const userimg = (document.getElementById("userimg").src =
    "./images/" + val.data[0].avatar);
}

async function setusercontent() {
  const box = document.querySelector(".editcontent");
  setprofileavatar();
  const data = await onlyfetchiddata();
  const name = await onlyfetchusername();
  const username = (document.getElementById(
    "username"
  ).value = `${name[0].username}`);
  let html = "";
  box.innerHTML = "";
  data.forEach((val) => {
    html += ` <div class="usercontent" value=${val.id}>
      <h1>${val.title}</h1>
      <p>${val.describetion}</p>
      <hr>
      <div class="editbtn">
        <button onclick="deletecontent(${val.id})">delete</button>
        <button onclick="gotoeditpage(${val.id})">edit</button>
      </div>
    </div>`;
  });
  box.innerHTML = html;
}

async function deletecontent(val) {
  const sign = confirm("are you sure to delete");
  if (sign) {
    const d = await axios.get(
      `https://sivaprakashblog.onrender.com/deletedata/${val}`,
      (withCredentials = true)
    );
    setusercontent();
  }
}

async function changeusername() {
  const username = document.getElementById("username").value;
  console.log(username);
  const post = await axios.post(
    `https://sivaprakashblog.onrender.com/updateusername`,
    {
      username: username,
    },
    {
      withCredentials: true,
    }
  );
}
async function setimage(val) {
  const userimg = (document.getElementById("userimg").src = "./images/" + val);
  console.log(val);
  const ele = await axios.post(
    "https://sivaprakashblog.onrender.com/updateimg",
    { img: val },
    {
      withCredentials: true,
    }
  );
}

function gotoeditpage(val) {
  const id = {
    conid: `${val}`,
  };
  const data = new URLSearchParams(id).toString();
  window.location = `https://sivaprakashblog.netlify.app/editcontent.html?${data}`;
}
