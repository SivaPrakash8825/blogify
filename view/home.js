// const user_name = document.querySelector("#user-details");

AOS.init();

const menuopen = document.querySelector(".lets");
const username = document.querySelector("#username");
const closebtn = document.querySelector(".slide-holder");
const slideholder = document.querySelector(".slidemenu");
const postview = document.querySelector(".postview");
const arr = [];

const preloader = document.getElementById("preloader");
window.addEventListener("load", () => {
  preloader.style.display = "none";
});

menuopen.addEventListener("click", () => {
  console.log("clicked");
  if (slideholder.classList.contains("active")) {
    slideholder.classList.remove("active");
  }
});

closebtn.addEventListener("click", () => {
  slideholder.classList.add("active");
});

window.addEventListener("DOMContentLoaded", async () => {
  const vale = await axios.get("http://127.0.0.1:3030/checkcook", {
    withCredentials: true,
  });
  if (vale.data != "exists") {
    window.location = "http://127.0.0.1:5500/clientview/index.html";
  } else {
    const val = await axios.get("http://127.0.0.1:3030/homedata", {
      withCredentials: true,
    });
    const dat = val.data;
    setheadimg(dat[0].user_id);
    username.innerHTML = dat[0].username;
    setcontent();
  }
});

async function setheadimg(id) {
  const val = await axios.get(`http://127.0.0.1:3030/getavatar/${id}`);
  document.querySelector(".profile img").src = "./images/" + val.data[0].avatar;
  document.querySelector("#imghead img").src = "./images/" + val.data[0].avatar;
}

async function removecookie() {
  const val = await axios.get("http://127.0.0.1:3030/removecookie", {
    withCredentials: true,
  });

  console.log(val.data);
}
async function fetchalldata() {
  const val = await axios.get("http://127.0.0.1:3030/alldata");
  const dat = val.data;
  return dat;
}

async function fetchuserid() {
  const userid = await axios.get("http://127.0.0.1:3030/userid", {
    withCredentials: true,
  });
  return userid;
}

async function getlikerid() {
  const userid = await fetchuserid();

  const val = await axios.get(`http://127.0.0.1:3030/likersdata`, {
    withCredentials: true,
  });
  const data = val.data;

  data.forEach((ele) => {
    let d = Number(ele.contentid);
    arr.push(d);
  });
  return arr;
}

async function setcontent() {
  const userid = await fetchuserid();

  const data = await fetchalldata();
  const contentid = await getlikerid();

  let html = "";
  data.forEach((val) => {
    html += `<div class="usercontent">
       <div class="boxuser">
         <div class="boxuserimage">
           <img src="./images/${val.avatar}" />
         </div>
         <p>${val.authorname}</p>
       </div>
       <h1>${val.title}</h1>
       <p>
         ${val.describetion}
       </p>
       <div class="infobtn">
         <div class="likebtn">
           <div class="likealign">`;
    if (contentid.includes(val.id)) {
      html += `<i class="ri-heart-fill red" onclick="clicklikebtn(${val.id})" id="x${val.id}"></i> <span id="likecount" class="x${val.id}">${val.likecount}</span>`;
    } else {
      html += ` <i class="ri-heart-fill white" onclick="clicklikebtn(${val.id})" id="x${val.id}"></i> <span id="likecount" class="x${val.id}">${val.likecount}</span>`;
    }
    html += `</div>

    <i class="ri-chat-1-line" ></i>
  </div>
  <div class="bookmark">
    <i class="ri-bookmark-line"></i>
  </div>
</div>
</div>`;
  });

  postview.innerHTML = html;
}

async function clicklikebtn(val) {
  const id = document.querySelector(`#x${val}`);
  const count = document.querySelector(`.x${val}`);
  const add = Number(count.innerHTML);

  if (id.classList.contains("white")) {
    id.classList.remove("white");
    id.classList.add("red");
    count.innerHTML = add + 1;
    await axios.post(
      `http://127.0.0.1:3030/increcount/${val}`,
      {
        count: `${add + 1}`,
      },
      {
        withCredentials: true,
      }
    );
  } else {
    id.classList.add("white");
    id.classList.remove("red");
    count.innerHTML = add - 1;
    await axios.post(
      `http://127.0.0.1:3030/decrecount/${val}`,
      {
        count: `${add - 1}`,
      },
      {
        withCredentials: true,
      }
    );
  }
}
