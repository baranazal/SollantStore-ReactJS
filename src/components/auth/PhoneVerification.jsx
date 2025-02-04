import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sendVerificationCode, verifyCode } from '@/services/phoneVerification';
import PropTypes from 'prop-types';

const PhoneVerification = ({ phoneNumber, onVerificationComplete }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [requestId, setRequestId] = useState('');
  const [error, setError] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendCode = async () => {
    try {
      const response = await sendVerificationCode(phoneNumber);
      setRequestId(response.request_id);
      setIsCodeSent(true);
    } catch (err) {
      console.error('Failed to send code:', err);
      setError('Failed to send verification code');
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyCode(requestId, verificationCode);
      onVerificationComplete();
    } catch (err) {
      console.error('Failed to verify code:', err);
      setError('Invalid verification code');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Phone Number</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCodeSent ? (
          <Button onClick={handleSendCode}>Send Verification Code</Button>
        ) : (
          <>
            <Input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button onClick={handleVerifyCode}>Verify Code</Button>
          </>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

PhoneVerification.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  onVerificationComplete: PropTypes.func.isRequired,
};

export default PhoneVerification; 