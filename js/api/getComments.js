let increment = 0;
const allComments = [];
const loadMore = document.getElementById("load-more");
const getComment = async (branchId, offsetNo) => {
  increment = increment + 2;
  const url = `https://superextraauto.defigame.org/api/get-comments?branch_id=${branchId}&offset=${
    increment - 2
  }`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const comment = await data?.data;

    allComments.push(...comment);

    injectComment();
  } catch (error) {
    console.log(error.message);
  }
};

(function () {
  const location = document.location.pathname;

  const branchName = location.split(".")[0];
  console.log(branchName);
  if (branchName === "/index" || branchName === "/") {
    getComment(2);
  }
  if (branchName === "/branch") {
    getComment(1);
  }
  if (branchName === "/branch-1") {
    getComment(2);
  }
  if (branchName === "/branch-2") {
    getComment(5);
  }
  if (branchName === "/branch-3") {
    getComment(6);
  }
  if (branchName === "/branch-4") {
    getComment(7);
  }

  // if (allComments.length === 0) {
  //   loadMore.style.display = "none";
  // }
})();

const postComment = async (e) => {
  e.preventDefault();

  const url = `https://superextraauto.defigame.org/api/comments`;
  // const url = `http://localhost:8000/api/comments`;
  const formData = new FormData(commentForm);

  const location = document.location.pathname;

  const branchName = location.split(".")[0];
  console.log(branchName);

  if (branchName === "/index" || branchName === "/") {
    formData.append("branch_id", "2");
  }
  if (branchName === "/branch") {
    formData.append("branch_id", "1");
  }
  if (branchName === "/branch-1") {
    formData.append("branch_id", "2");
  }
  if (branchName === "/branch-2") {
    formData.append("branch_id", "5");
  }
  if (branchName === "/branch-3") {
    formData.append("branch_id", "6");
  }
  if (branchName === "/branch-4") {
    formData.append("branch_id", "7");
  }

  console.log(formData.get("branch_id"));

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    allComments.unshift(data?.data);

    injectComment();
  } catch (error) {
    console.log(error);
  }
};

const commentForm = document.getElementById("commentForm");

commentForm?.addEventListener("submit", postComment);

const injectComment = () => {
  const commentContainer = document.getElementById("comment-container");
  commentContainer.innerHTML = "";
  allComments.forEach((comment) => {
    const elem = document.createElement("div");

    elem.innerHTML = `
       <div class="comment mb-3">
            <div class="d-flex gap-3 align-items-center mb-2">
              <img
                src="./images/user.png"
                alt="User Image"
                style="width: 40px; height: 40px"
              />
              <span class="fw-semibold">${comment?.author}</span>
            </div>
            <div class="conmment-body">
              <p>
                <small
                  >${comment?.comment}</small
                >
              </p>
            </div>
          </div>
       `;

    commentContainer.appendChild(elem);
  });
};

// Rating Start
  const stars = document.querySelectorAll('.star-rating .star');
  const ratingValue = document.getElementById('ratingValue');

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const value = parseInt(star.getAttribute('data-value'));
      ratingValue.value = value;

      stars.forEach(s => {
        s.classList.toggle('filled', parseInt(s.getAttribute('data-value')) <= value);
      });
    });
  });
// Rating End

// Dynamic Rating Show start

const branchListContainer = document.getElementById("branch-list");

async function fetchBranches() {
  try {
    const branchUrl = `https://superextraauto.defigame.org/api/branches`;
  // const branchUrl = `http://localhost:8000/api/branches`;

    const res = await fetch(branchUrl);
    const result = await res.json();
    const branches = result.data;

    branches.forEach(branch => {
      showStarsInDiv(branch.id, branch.average_rating);
    });
  } catch (error) {
    console.error("Error fetching branches:", error);
  }
}

// ⭐ Star generator function
function generateStarHtml(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    "★".repeat(full) +
    (half ? '<span class="star half">★</span>' : "") +
    "☆".repeat(empty)
  );
}

fetchBranches();

function showStarsInDiv(branchId, averageRating) {
  const div = document.getElementById(`rating_show_${branchId}`);
  if (!div) return;

  const fullStars = Math.floor(averageRating);
  const halfStar = averageRating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  let starsHtml = '';
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<span style="color: #FFD700; font-size: 20px;">&#9733;</span>'; // full
  }
  if (halfStar) {
    starsHtml += '<span style="color: #FFD700; font-size: 20px; position: relative;">&#9733;<span style="position: absolute; overflow: hidden; width: 50%; top: 0; left: 0; color: #ccc;">&#9733;</span></span>'; // half
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<span style="color: #ccc; font-size: 20px;">&#9733;</span>'; // empty
  }

  div.innerHTML = starsHtml;
}

// Dynamic Rating Show end
