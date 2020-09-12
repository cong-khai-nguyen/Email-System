document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


  // By default, load the inbox
  load_mailbox('inbox');

});

function compose_email() {

  document.querySelector('#compose-form').addEventListener("submit", (event) => {

    // Fetching datas]
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value,
      })

    })
      .then(response => response.json())
      .then(result => {
        // Print result
        console.log(result);
      });
    
    load_mailbox('sent');
    event.preventDefault();
    return false;
  });

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#emails-content-view').style.display = 'none';

  //Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';



}
function reply(emails) {
  compose_email()
  console.log(emails)

  sender = emails['sender']
  recipient = emails['recipients']
  subject = emails['subject']
  body = emails['body']
  timestamp = emails['timestamp']

  document.querySelector('#compose-recipients').value = sender;
  document.querySelector('#compose-recipients').disabled = true;

  emailUpperCase = emails['subject'].toUpperCase();
  if (emails['subject'].toUpperCase().includes("RE:"))
    document.querySelector('#compose-subject').value = subject;
  else
    document.querySelector('#compose-subject').value = "Re: " + subject;
  if (body.length !== 0)
    document.querySelector('#compose-body').value = "On " + timestamp + " " + sender + " wrote: " + body + "."
  else
    document.querySelector('#compose-body').value = "On " + timestamp + " " + sender + " sent you an email and it has no content."

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
}

function load_mailbox(mailbox) {

  var mailbox = String(mailbox)

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`./emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);

      // Do something with emails

      if (mailbox === "sent") {
        let count = 0;
        for (var i = 0; i < emails.length; i += 1) {
          let id = emails[i]["id"];
          let rec = "";

          // Create a div
          const element = document.createElement('div');

          // Give that div class called sent and id = id
          element.setAttribute("class", "sent2");
          element.id = count

          // Create a first p tag containing just email
          const para = document.createElement('p');
          // Set class name
          para.setAttribute("class", "email")

          // For Loop to find how many recipients
          rec = emails[i]["recipients"]
          var node = document.createTextNode(rec)
          para.appendChild(node);
          // Create a second p tag containing just subject line
          const para2 = document.createElement('p');
          para2.setAttribute("class", "subject")
          para2.appendChild(document.createTextNode(emails[i]["subject"]))
          // Create a third p tag containing just timestamp
          const para3 = document.createElement('p');
          para3.setAttribute("class", "timestamp");
          para3.appendChild(document.createTextNode(emails[i]["timestamp"]));
          
          // Append all to the enmail view
          document.querySelector('#emails-view').append(element);
          document.getElementById(count).append(para);
          document.getElementById(count).append(para2);
          document.getElementById(count).append(para3);

          count++;

        }
      }

      // ELSE IF MAILBOX is INBOX
      else if (mailbox === "inbox") {
        let count = 0;
        for (var i = 0; i < emails.length; i += 1) {
          let id = emails[i]["id"];
          let rec = "";

          // Create an a tag
          const a = document.createElement('a');
          a.setAttribute("class", "overlay")
          a.id = id
          a.href = "#";
          a.style.color = "black";

          // Create a div
          const element = document.createElement('div');

          // Give that div class called sent and id = id
          element.setAttribute("class", "sent block");
          element.id = count

          // Create a first p tag containing just email
          const para = document.createElement('p');
          // Set class name
          para.setAttribute("class", "email")

          // For Loop to find how many recipients
          rec = emails[i]["sender"]
          var node = document.createTextNode(rec)
          para.appendChild(node);
          // Create a second p tag containing just subject line
          const para2 = document.createElement('p');
          para2.setAttribute("class", "subject")
          para2.appendChild(document.createTextNode(emails[i]["subject"]))
          // Create a third p tag containing just timestamp
          const para3 = document.createElement('p');
          para3.setAttribute("class", "timestamp");
          para3.appendChild(document.createTextNode(emails[i]["timestamp"]));
          // Create an image tag
          const img = document.createElement('img');
          img.src = "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_archive_48px-512.png";
          img.setAttribute("class", "img")

          // Create a div to contain image
          const div2 = document.createElement('div');
          div2.setAttribute("class", "contain_img inner")
          div2.id = "img" + count;
          // Create an a tag for archive
          const a2 = document.createElement('a');
          a2.id = "a" + count;
          a2.href = "#";
          a2.title = "Archive";
          // Append all to the enmail view
          document.querySelector('#emails-view').append(element);



          document.getElementById(count).append(a);

          document.getElementById(count).append(para);
          document.getElementById(count).append(para2);
          document.getElementById(count).append(div2);
          document.getElementById("img" + count).append(a2)
          document.getElementById("a" + count).append(img)

          document.getElementById(count).append(para3);

          if (emails[i]['read']) {
            document.getElementById(count).style.backgroundColor = "#F5F7F7";

          }

          document.getElementById(id).onclick = () => {
            render_content(id);
            return false
          }
          document.getElementById("a" + count).onclick = () => {
            archive(id)
            return false
          }
          count++;
        }
      }


      // ELSE IF MAILBOX is archive
      else if (mailbox === "archive") {
        let count = 0;
        for (var i = 0; i < emails.length; i += 1) {
          let id = emails[i]["id"];
          let rec = "";

          // Create an a tag
          const a = document.createElement('a');
          a.setAttribute("class", "overlay")
          a.id = id
          a.href = "#";
          a.style.color = "black";

          // Create a div
          const element = document.createElement('div');

          // Give that div class called sent and id = id
          element.setAttribute("class", "sent block");
          element.id = count

          // Create a first p tag containing just email
          const para = document.createElement('p');
          // Set class name
          para.setAttribute("class", "email")

          // For Loop to find how many recipients
          rec = emails[i]["sender"]
          var node = document.createTextNode(rec)
          para.appendChild(node);
          // Create a second p tag containing just subject line
          const para2 = document.createElement('p');
          para2.setAttribute("class", "subject")
          para2.appendChild(document.createTextNode(emails[i]["subject"]))
          // Create a third p tag containing just timestamp
          const para3 = document.createElement('p');
          para3.setAttribute("class", "timestamp");
          para3.appendChild(document.createTextNode(emails[i]["timestamp"]));
          // Create an image tag
          const img = document.createElement('img');
          img.src = "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_archive_48px-512.png";
          img.setAttribute("class", "img")

          // Create a div to contain image
          const div2 = document.createElement('div');
          div2.setAttribute("class", "contain_img inner")
          div2.id = "img" + count;
          // Create an a tag for unarchive
          const a2 = document.createElement('a');
          a2.id = "a" + count;
          a2.href = "#";
          a2.title = "Unarchive";
          // Append all to the enmail view
          document.querySelector('#emails-view').append(element);


          if (emails[i]['read']) {
            document.getElementById(count).style.backgroundColor = "#F5F7F7";

          }
          document.getElementById(count).append(a);

          document.getElementById(count).append(para);
          document.getElementById(count).append(para2);
          document.getElementById(count).append(div2);
          document.getElementById("img" + count).append(a2)
          document.getElementById("a" + count).append(img)

          document.getElementById(count).append(para3);


          document.getElementById(id).onclick = () => {
            render_content(id);

          }
          document.getElementById("a" + count).onclick = () => {
            unarchive(id)

          }
          count++;

        }

      }

    });
  // Show the mailbox and hide other views

  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-content-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';




}













function render_content(id) {
  // ALTER the data. SET read to TRUE
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
  // GET the data by its id
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(emails => {
      // Print email
      console.log(emails);

      // ... do something else with email ...
      emails['read'] = true;
      sender = emails['sender']
      recipient = emails['recipients']
      subject = emails['subject']
      body = emails['body']
      timestamp = emails['timestamp']
      // Display the content of email
      document.getElementById('from').innerHTML = sender;
      document.getElementById('to').innerHTML = recipient;
      document.getElementById('subject').innerHTML = subject;
      document.getElementById('timestamp').innerHTML = timestamp;
      if (body.trim().length === 0)
        document.getElementById('body').innerHTML = "This email has no content";
      else
        document.getElementById('body').innerHTML = body;
      document.querySelector('#reply').onclick = () => {
        reply(emails)
      }
    });





  // Show the mailbox and hide other views
  document.querySelector('#emails-content-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';


}

function archive(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  })
  window.location.reload(false);

}
function unarchive(id) {

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  })
  // Show the mailbox and hide other views

  window.location.reload(false);

}