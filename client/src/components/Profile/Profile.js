import React from 'react';
import { Box, Button, Text, Avatar, Card } from 'gestalt';
import 'gestalt/dist/gestalt.css';

const ProfilePage = () => {
  return (
    <Box maxWidth={236} padding={2} column={12}>
      <Card
        image={
          <Avatar name="James Jones" src="https://i.ibb.co/2Fc00R3/james.jpg" />
        }
      >
        <Text align="center" weight="bold">
          <Box paddingX={3} paddingY={2}>
            James Jones
          </Box>
        </Text>
        <Button
          accessibilityLabel="Sign out of your account"
          color="red"
          text="Sign out"
        />
      </Card>
    </Box>
  );
};
export default ProfilePage;
