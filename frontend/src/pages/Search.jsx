import { useState } from "react";
import "./Search.css";

function Search() {
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setSearchData({
      ...searchData,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Search Data:", searchData);
  }

  return (
    <div className="search-page">

      <div className="search-container">

        <h1>Search Tickets</h1>

        <p>Find the best tickets for your journey.</p>

        <form
          className="search-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label>From</label>

            <input
              type="text"
              name="from"
              placeholder="Enter source"
              value={searchData.from}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>To</label>

            <input
              type="text"
              name="to"
              placeholder="Enter destination"
              value={searchData.to}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Journey Date</label>

            <input
              type="date"
              name="date"
              value={searchData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Passengers</label>

            <input
              type="number"
              name="passengers"
              min="1"
              max="10"
              value={searchData.passengers}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            Search Tickets
          </button>

        </form>

      </div>

    </div>
  );
}

export default Search;