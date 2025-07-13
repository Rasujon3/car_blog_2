const branchSelect = document.getElementById('branchSelect');
const messageTextarea = document.getElementById('msg');

// Fetch branch list on page load
window.addEventListener('DOMContentLoaded', () => {
fetch('https://superextraauto.defigame.org/api/branches')
    .then(res => res.json())
    .then(data => {
    if (data.status && Array.isArray(data.data)) {
        data.data.forEach(branch => {
        const option = document.createElement('option');
        option.value = branch.id;
        option.textContent = branch.name;
        option.dataset.name = branch.name;
        option.dataset.email = branch.email;
        branchSelect.appendChild(option);
        });
    }
    })
    .catch(err => {
    console.error('Error loading branches:', err);
    });
});

// On branch selection, update the message textarea
branchSelect.addEventListener('change', (e) => {
const selectedOption = e.target.options[e.target.selectedIndex];
const name = selectedOption.dataset.name;
const email = selectedOption.dataset.email;

// if (name && email) {
//     const branchDetails = `Name: ${name}, Email: ${email}`;
//     messageTextarea.value = branchDetails + "\n\n" + messageTextarea.value;
// }
});

// --- Main Send Script Start --- //

//   const branchSelect = document.getElementById('branchSelect');
  let branchMap = {}; // to map id to name/email

  // ✅ Load branches
  window.addEventListener('DOMContentLoaded', () => {
    fetch('https://superextraauto.defigame.org/api/branches')
      .then(res => res.json())
      .then(data => {
        if (data.status) {
          data.data.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch.id;
            option.textContent = branch.name;
            branchSelect.appendChild(option);

            // Save data for email body
            branchMap[branch.id] = {
              name: branch.name,
              email: branch.email
            };
          });
        }
      });
  });

  // ✅ Submit form and send mail
  document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const fname = document.getElementById('fname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const msg = document.getElementById('msg').value.trim();
    const branchId = branchSelect.value;

    if (!branchId) {
      alert('Please select a branch.');
      return;
    }

    const branch = branchMap[branchId];

    const fullMessage =
        `Name: ${fname}, Email: ${email || branch.email}, Phone: ${phone}.\n\n` +
        `${msg}\n\n`;

    // Prepare form-data
    const formData = new FormData();
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('body', fullMessage);

    // Send email
    fetch('https://branch-mail.jplink.space/superextra/api/send-email', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(response => {
        alert('Message sent successfully!');
        document.getElementById('contactForm').reset();
        window.location.reload(); // Reload to reset branch selection
      })
      .catch(err => {
        console.error('Mail API Error:', err);
        alert('Failed to send message. Try again later.');
      });
  });


// --- Main Send Script End --- //
