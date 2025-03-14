import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import styles from './Notification.module.css';

export default function Notification() {
  const { notification, notificationType, clearNotification } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(!!notification);
  }, [notification]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => clearNotification(), 300); // Wait for fade out animation
  };
  
  if (!notification) {
    return null;
  }
  
  // Determine style based on notification type
  const typeStyles = {
    info: styles.info,
    success: styles.success,
    warning: styles.warning,
    error: styles.error
  };
  
  const typeClass = typeStyles[notificationType] || styles.info;
  
  return (
    <div className={`${styles.notification} ${isVisible ? styles.show : styles.hide} ${typeClass}`}>
      <p>{notification}</p>
      <button className={styles.closeButton} onClick={handleClose}>
        ×
      </button>
    </div>
  );
} 