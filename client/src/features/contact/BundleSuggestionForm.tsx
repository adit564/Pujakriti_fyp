import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../app/models/user";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import "../../app/styles/index.css"; // Make sure you import your global styles!

const BundleSuggestionForm = () => {
  const userString = localStorage.getItem("user");
  let currentUser: { user_Id: number | undefined } | null = null;
  const [userResponse, setUser] = useState<User | null>(null);

  if (userString) {
    try {
      currentUser = JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing user data from local storage:", error);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = currentUser?.user_Id;
        if (userId) {
          const userResp = await agent.User.getUser(userId);
          setUser(userResp);
        }
      } catch (error) {
        toast.error("Failed to fetch user: " + error);
      }
    };
    fetchUser();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bundleName: "",
    bundlePuja: "",
    bundleCaste: "",
    description: "",
  });

  useEffect(() => {
    if (userResponse) {
      setFormData(prev => ({
        ...prev,
        name: userResponse.name,
        email: userResponse.email,
      }));
    }
  }, [userResponse]);

  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="content-container">
          <h2>Please log in to make suggestions.</h2>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/api/communication/bundle-suggestion", formData);
      toast.success("Suggestion sent successfully!");
      setFormData({
        name: userResponse?.name || "",
        email: userResponse?.email || "",
        bundleName: "",
        bundlePuja: "",
        bundleCaste: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send suggestion.");
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h1 className="contact-title">Suggest a Bundle</h1>
        <p className="contact-subtitle">Have an idea for a new bundle? Let us know!</p>
        
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="bundleName" className="form-label">Bundle Name</label>
            <input
              type="text"
              id="bundleName"
              name="bundleName"
              value={formData.bundleName}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bundlePuja" className="form-label">Puja</label>
            <input
              type="text"
              id="bundlePuja"
              name="bundlePuja"
              value={formData.bundlePuja}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bundleCaste" className="form-label">Caste</label>
            <input
              type="text"
              id="bundleCaste"
              name="bundleCaste"
              value={formData.bundleCaste}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              className="form-textarea"
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Submit Suggestion
          </button>
        </form>
      </div>
    </div>
  );
};

export default BundleSuggestionForm;
