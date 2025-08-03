fetch('repos.json')
  .then(response => response.json())
  .then(repos => {
    const list = document.getElementById('repo-list');
    list.innerHTML = '';
    repos.forEach(repo => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${repo.url}" target="_blank">${repo.name}</a>
        <span> by ${repo.owner} — Last updated ${repo.last_updated}</span>
        <div style="font-size: 0.9em; color: #555;">${repo.description}</div>
      `;
      list.appendChild(li);
    });
  });
