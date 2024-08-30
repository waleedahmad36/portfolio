// components/ReviewForm.js
"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/app/config/firebaseConfig"; // Make sure this path is correct
import { collection, addDoc, getDocs } from "firebase/firestore";

const ReviewForm = () => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  // Reference to the "reviews" collection in Firestore
  const reviewsCollection = collection(db, "reviews");

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && comment) {
      try {
        await addDoc(reviewsCollection, {
          name,
          comment,
          timestamp: new Date(),
        });
        setName("");
        setComment("");
        fetchReviews(); // Refresh reviews after submission
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  // Function to fetch reviews from Firestore
  const fetchReviews = async () => {
    try {
      const reviewSnapshot = await getDocs(reviewsCollection);
      const reviewsList = reviewSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsList);
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    }
  };

  // Fetch reviews when the component mounts
  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5 text-center">Share Your Experience</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Your Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">What People Are Saying:</h3>
        {reviews.map((review) => (
          <div key={review.id} className="border p-4 rounded-lg">
            <p className="font-bold">{review.name}</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewForm;
