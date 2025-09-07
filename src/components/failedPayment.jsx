import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactGA from 'react-ga4';

function FailedPaymentRedirect() {
  const pageTitle = 'Payment Failed';
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // fire pageview manually for failed-payment
    ReactGA.send({
      hitType: 'pageview',
      page: '/failed-payment',
      title: pageTitle,
    });

    // redirect after a short delay so GA call is not skipped
    const timer = setTimeout(() => setShouldRedirect(true), 100);

    return () => clearTimeout(timer);
  }, []);

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      {/* Optional: show a tiny message while redirecting */}
      <p>Redirecting...</p>
    </>
  );
}

export default FailedPaymentRedirect;
