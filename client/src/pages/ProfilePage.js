import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import { useCart } from '../context/cartContext';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser } = useContext(UserContext);
  const { cart, getCartTotal, getCartItemCount } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [userInfo, setUserInfo] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'Malaysia'
  });

  useEffect(() => {
    // Update userInfo when user context changes
    if (user) {
      setUserInfo({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        zipCode: user.zipCode || '',
        country: user.country || 'Malaysia'
      });
    }
  }, [user]);

  useEffect(() => {
    // Load order history (mock data for now)
    setOrderHistory([
      {
        id: 'ORD-001',
        date: '2024-08-10',
        total: 158.97,
        status: 'Delivered',
        items: 3
      },
      {
        id: 'ORD-002',
        date: '2024-08-05',
        total: 89.99,
        status: 'Shipped',
        items: 1
      },
      {
        id: 'ORD-003',
        date: '2024-07-28',
        total: 245.50,
        status: 'Processing',
        items: 5
      }
    ]);
  }, []);

  const handleInputChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    try {
      await updateUser(userInfo);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#28a745';
      case 'Shipped': return '#007bff';
      case 'Processing': return '#ffc107';
      case 'Cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="header-content">
            <div className="user-avatar">
              <i className="pi pi-user"></i>
            </div>
            <div className="user-details">
              <h1>Hello, {user?.username || 'User'}!</h1>
              <p>Manage your account settings and view your order history</p>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="quick-stats">
              <h3>Quick Stats</h3>
              <div className="stat-item">
                <i className="pi pi-shopping-cart"></i>
                <div>
                  <span className="stat-value">{getCartItemCount()}</span>
                  <span className="stat-label">Items in Cart</span>
                </div>
              </div>
              <div className="stat-item">
                <i className="pi pi-dollar"></i>
                <div>
                  <span className="stat-value">RM {getCartTotal().toFixed(2)}</span>
                  <span className="stat-label">Cart Total</span>
                </div>
              </div>
              <div className="stat-item">
                <i className="pi pi-box"></i>
                <div>
                  <span className="stat-value">{orderHistory.length}</span>
                  <span className="stat-label">Total Orders</span>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <Link to="/cart">
                <Button
                  label="View Cart"
                  icon="pi pi-shopping-cart"
                  className="action-btn"
                  outlined
                />
              </Link>
              <Link to="/">
                <Button
                  label="Continue Shopping"
                  icon="pi pi-shopping-bag"
                  className="action-btn"
                  outlined
                />
              </Link>
            </div>
          </div>

          <div className="profile-main">
            <Card className="profile-info-card">
              <div className="card-header">
                <h2>Personal Information</h2>
                <Button
                  label={isEditing ? "Cancel" : "Edit"}
                  icon={isEditing ? "pi pi-times" : "pi pi-pencil"}
                  className="edit-btn"
                  onClick={() => setIsEditing(!isEditing)}
                  outlined
                />
              </div>

              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Username</label>
                    <InputText
                      name="username"
                      value={userInfo.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <InputText
                      name="email"
                      value={userInfo.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <InputText
                      name="firstName"
                      value={userInfo.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <InputText
                      name="lastName"
                      value={userInfo.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <InputText
                      name="phone"
                      value={userInfo.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <InputText
                      name="country"
                      value={userInfo.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <InputText
                    name="address"
                    value={userInfo.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <InputText
                      name="city"
                      value={userInfo.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <InputText
                      name="zipCode"
                      value={userInfo.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <Button
                      label="Save Changes"
                      icon="pi pi-check"
                      onClick={handleSaveProfile}
                      className="save-btn"
                    />
                  </div>
                )}
              </div>
            </Card>

            <Card className="order-history-card">
              <h2>Order History</h2>
              <div className="order-list">
                {orderHistory.length === 0 ? (
                  <div className="no-orders">
                    <i className="pi pi-box"></i>
                    <p>No orders yet</p>
                    <Link to="/">
                      <Button label="Start Shopping" icon="pi pi-shopping-bag" />
                    </Link>
                  </div>
                ) : (
                  orderHistory.map(order => (
                    <div key={order.id} className="order-item">
                      <div className="order-info">
                        <div className="order-id">
                          <strong>Order #{order.id}</strong>
                          <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div className="order-details">
                          <span>{order.items} item{order.items !== 1 ? 's' : ''}</span>
                          <span className="order-total">RM {order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="order-status">
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
