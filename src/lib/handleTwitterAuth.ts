import { PublicKey } from "@solana/web3.js";

export const checkTwitterStatus = async (publicKey: string) => {
    if (!publicKey) return;

    try {
        const response = await fetch('/api/twitterAuth/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                wallet: publicKey
            })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking Twitter status:', error);
    }
};
// Handle Twitter Auth
export const handleTwitterAuth = async (publicKey: PublicKey) => {
    try {

      // Get OAuth URL from our API
      const response = await fetch('/api/twitterAuth/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          wallet: publicKey.toString(),
          origin: window.location.origin
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate Twitter authentication');
      }

      const { url } = await response.json();

      // Open Twitter auth in a popup
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        url,
        'Twitter Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Check if popup was blocked
      if (!popup) {
        console.error('Popup was blocked');
        return;
      }

      // Start checking if popup closed
      const checkPopupClosed = setInterval(async () => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          // Always check Twitter status when popup closes
          const twitterStatus = await checkTwitterStatus(publicKey.toString());
          return twitterStatus;
        }
      }, 1000);

    } catch (error) {
      console.error('Twitter auth error:', error);
    }
  };
