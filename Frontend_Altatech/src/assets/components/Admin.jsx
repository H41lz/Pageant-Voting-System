import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../api.js';
import './Admin.css';
import './login.css';

export default function Admin() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  
  // Form states
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    description: '',
    image: null
  });
  
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    image: null
  });

  const user = localStorage.getItem("currentUser");
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (user !== 'admin') {
      navigate('/');
      return;
    }
    loadCandidates();
  }, [user, navigate]);

  // Load candidates from backend
  const loadCandidates = async () => {
    try {
      setLoading(true);
      const backendCandidates = await ApiService.fetchCandidates();
      setCandidates(backendCandidates);
      setError('');
    } catch (error) {
      console.error('Failed to load candidates:', error);
      setError('Failed to load candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle new candidate form submission
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidate.name.trim()) {
      setError('Candidate name is required');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', newCandidate.name);
      formData.append('description', newCandidate.description || '');
      if (newCandidate.image) {
        formData.append('image', newCandidate.image);
      }

      await ApiService.createCandidate(formData);
      setSuccess('Candidate added successfully!');
      setNewCandidate({ name: '', description: '', image: null });
      setShowAddForm(false);
      loadCandidates(); // Reload the list
    } catch (error) {
      console.error('Failed to add candidate:', error);
      setError('Failed to add candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit candidate form submission
  const handleEditCandidate = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setError('Candidate name is required');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description || '');
      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      await ApiService.updateCandidate(editingCandidate.id, formData);
      setSuccess('Candidate updated successfully!');
      setEditingCandidate(null);
      setEditForm({ name: '', description: '', image: null });
      loadCandidates(); // Reload the list
    } catch (error) {
      console.error('Failed to update candidate:', error);
      setError('Failed to update candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete candidate
  const handleDeleteCandidate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    try {
      setLoading(true);
      await ApiService.deleteCandidate(id);
      setSuccess('Candidate deleted successfully!');
      loadCandidates(); // Reload the list
    } catch (error) {
      console.error('Failed to delete candidate:', error);
      setError('Failed to delete candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Start editing a candidate
  const startEdit = (candidate) => {
    setEditingCandidate(candidate);
    setEditForm({
      name: candidate.name,
      description: candidate.description || '',
      image: null
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingCandidate(null);
    setEditForm({ name: '', description: '', image: null });
  };

  // Handle file input change
  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(prev => ({ ...prev, image: file }));
    }
  };

  // Handle input change
  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading && candidates.length === 0) {
    return (
      <div className="admin-container">
        <div className="loading">Loading candidates...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Panel - Candidate Management</h2>
        <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Add Candidate Section */}
      <div className="admin-section">
        <div className="section-header">
          <h3>Add New Candidate</h3>
          <button 
            className="toggle-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Hide Form' : 'Show Form'}
          </button>
        </div>
        
        {showAddForm && (
          <form onSubmit={handleAddCandidate} className="candidate-form">
            <div className="form-group">
              <label>Name: *</label>
              <input
                type="text"
                name="name"
                value={newCandidate.name}
                onChange={(e) => handleInputChange(e, setNewCandidate)}
                placeholder="Enter candidate name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={newCandidate.description}
                onChange={(e) => handleInputChange(e, setNewCandidate)}
                placeholder="Enter candidate description"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Photo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setNewCandidate)}
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Candidate'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Candidates List */}
      <div className="admin-section">
        <h3>Manage Candidates ({candidates.length})</h3>
        
        {candidates.length === 0 ? (
          <div className="no-candidates">
            <p>No candidates found. Add your first candidate above.</p>
          </div>
        ) : (
          <div className="candidates-grid">
            {candidates.map(candidate => (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-image">
                  <img 
                    src={candidate.image || 'https://via.placeholder.com/200x200?text=No+Image'} 
                    alt={candidate.name}
                  />
                </div>
                
                <div className="candidate-info">
                  <h4>{candidate.name}</h4>
                  {candidate.description && (
                    <p className="description">{candidate.description}</p>
                  )}
                  <p className="created-at">
                    Created: {new Date(candidate.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="candidate-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => startEdit(candidate)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteCandidate(candidate.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingCandidate && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Candidate: {editingCandidate.name}</h3>
              <button className="close-btn" onClick={cancelEdit}>&times;</button>
            </div>
            
            <form onSubmit={handleEditCandidate} className="candidate-form">
              <div className="form-group">
                <label>Name: *</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={(e) => handleInputChange(e, setEditForm)}
                  placeholder="Enter candidate name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={(e) => handleInputChange(e, setEditForm)}
                  placeholder="Enter candidate description"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Photo:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setEditForm)}
                />
                <small>Leave empty to keep current image</small>
              </div>
              
              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Candidate'}
                </button>
                <button 
                  type="button" 
                  onClick={cancelEdit}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}