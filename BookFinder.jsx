import React, { useState, useEffect } from "react";
import "./App.css"; // import the CSS file

const COVER_URL = (cover_i, size = "M") =>
  cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-${size}.jpg` : null;

export default function BookExplorer() {
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [numFound, setNumFound] = useState(0);

  const perPage = 24;

  useEffect(() => {
    if (!query && !author && !year && !subject) {
      setResults([]);
      setNumFound(0);
      return;
    }

    setLoading(true);

    let url = `https://openlibrary.org/search.json?page=${page}&limit=${perPage}`;
    if (query) url += `&title=${encodeURIComponent(query)}`;
    if (author) url += `&author=${encodeURIComponent(author)}`;
    if (year) url += `&first_publish_year=${encodeURIComponent(year)}`;
    if (subject) url += `&subject=${encodeURIComponent(subject)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.docs || []);
        setNumFound(data.numFound || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [query, author, year, subject, page]);

  const totalPages = Math.ceil(numFound / perPage);

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <h1>Books & Authors</h1>
      </header>

      <div className="main">
        {/* Sidebar */}
       <div className="mainfilters">
         <aside className="sidebar">
          <h3>Filters</h3>
          <label>Title</label>
          <input
            placeholder="Enter title..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />

          <label>Author</label>
          <input
            placeholder="e.g. J.K. Rowling"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              setPage(1);
            }}
          />

          <label>Year</label>
          <input
            placeholder="e.g. 1997"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setPage(1);
            }}
          />

          <label>Subject</label>
          <input
            placeholder="e.g. Fantasy"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setPage(1);
            }}
          />
        </aside>
       </div>

        {/* Content */}
        <section className="content">
          {loading && <div className="loading">Loading …</div>}

          {!loading && results.length === 0 && (query || author || year || subject) && (
            <div className="no-results">No results found</div>
          )}

          <div className="grid">
            {results.map((book) => {
              const cover = COVER_URL(book.cover_i);
              return (
                <div key={book.key} className="card">
                  {cover ? (
                    <img src={cover} alt={book.title} />
                  ) : (
                    <div className="no-cover">No Cover</div>
                  )}
                  <div className="card-body">
                    <h2>{book.title}</h2>
                    <p className="author">
                      {book.author_name?.join(", ") || "Unknown Author"}
                    </p>
                    {book.first_publish_year && (
                      <p className="year">📅 {book.first_publish_year}</p>
                    )}
                    <a
                      href={`https://openlibrary.org${book.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Details →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                ← Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>

      <footer className="footer">
        <small>Powered by OpenLibrary API</small>
      </footer>
    </div>
    
  );
  
}
<div className="filter-bar">
  <div className="filter-item">
    <label>Title</label>
    <input type="text" placeholder="e.g. Harry Potter" />
  </div>
  <div className="filter-item">
    <label>Author</label>
    <input type="text" placeholder="e.g. J.K. Rowling" />
  </div>
  <div className="filter-item">
    <label>Year</label>
    <input type="text" placeholder="e.g. 1997" />
  </div>
  <div className="filter-item">
    <label>Subject</label>
    <input type="text" placeholder="e.g. Fantasy" />
  </div>
  <button className="search-btn">Search</button>
</div>


// ...existing code...
