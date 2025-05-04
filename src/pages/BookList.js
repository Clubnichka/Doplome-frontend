import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookList = () => {
  const { id } = useParams(); // Получаем id книги из URL
  const [book, setBook] = useState(null);

  useEffect(() => {
    // Получаем книгу по id
    axios.get(`http://localhost:8080/books/${id}`)
      .then(response => setBook(response.data))
      .catch(error => console.error("There was an error fetching the book!", error));
  }, [id]);

  if (!book) return <div>Loading...</div>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.author}</p>
      <p>{book.publisher}</p>
      <p>{book.genre}</p>
      <p>{book.releaseDate}</p>
      <div>{book.content}</div> {/* Assuming book content is a string */}
    </div>
  );
};

export default BookList;