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

      // Open Twitter auth in a new tab
      const newTab = window.open(url, '_blank');
      if (!newTab) {
        console.error('New tab was blocked');
        return;
      }

      // Start checking if popup closed
      const checkPopupClosed = setInterval(async () => {
        if (newTab.closed) {
          clearInterval(checkPopupClosed);
          // Always check Twitter status when popup closes
          const twitterStatus = await checkTwitterStatus(publicKey.toString());
          return twitterStatus;
        }
      }, 1000);

      // Listen for messages from the popup
      window.addEventListener('message', async (event) => {
        if (event.origin !== window.location.origin) return; // Ensure the message is from the same origin
        if (event.data.type === 'TWITTER_AUTH_SUCCESS') {
          // Close the popup if it is still open
          if (newTab) {
            newTab.close();
          }
          // Optionally, handle the success data here
          console.log('Twitter Auth Success:', event.data);
        }
      });

    } catch (error) {
      console.error('Twitter auth error:', error);
    }
  };
