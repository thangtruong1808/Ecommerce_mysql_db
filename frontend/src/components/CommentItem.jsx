/**
 * Comment Item Component
 * Individual comment display with edit/delete functionality
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Button from "./Button";
import { FaEdit, FaTrash, FaUser } from "react-icons/fa";

/**
 * Format date to dd-MMM-yyyy, hh:mm AM/PM format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 * @author Thang Truong
 * @date 2025-12-12
 */
const formatDate = (date) => {
  const d = new Date(date);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, "0");
  return `${day}-${month}-${year}, ${hoursStr}:${minutes} ${ampm}`;
};

/**
 * CommentItem component
 * @param {Object} props - Component props
 * @param {Object} props.comment - Comment object
 * @param {Function} props.onUpdate - Callback after comment update
 * @param {Function} props.onDelete - Callback after comment deletion
 * @returns {JSX.Element} Comment item component
 * @author Thang Truong
 * @date 2025-12-12
 */
const CommentItem = ({ comment, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment);
  const [loading, setLoading] = useState(false);

  /**
   * Handle edit button click
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleEdit = () => {
    setIsEditing(true);
    setEditText(comment.comment);
  };

  /**
   * Handle cancel edit
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleCancel = () => {
    setIsEditing(false);
    setEditText(comment.comment);
  };

  /**
   * Handle save edit
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleSave = async () => {
    if (!editText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `/api/comments/${comment.id}`,
        {
          comment: editText,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Comment updated successfully!");
      setIsEditing(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update comment";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle delete comment
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/api/comments/${comment.id}`, {
        withCredentials: true,
      });
      toast.success("Comment deleted successfully!");
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete comment";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user && user.id === comment.user_id;
  const date = formatDate(comment.created_at);

  /* Comment item layout */
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      {/* Comment header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {/* User icon */}
          <FaUser className="text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{comment.user_name}</p>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
        </div>

        {/* Edit/Delete buttons (owner only) */}
        {isOwner && !isEditing && (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              icon={<FaEdit />}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              loading={loading}
              icon={<FaTrash />}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Comment content */}
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              loading={loading}
            >
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700">{comment.comment}</p>
      )}
    </div>
  );
};

export default CommentItem;
