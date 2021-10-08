import React, { useEffect, useState } from 'react';
import Profile from './Profile/Profile';
import { navigate } from '@reach/router';
import { useDispatch } from 'react-redux';
import SignList from './Lists/SignList';
import SignedList from './Lists/SignedList';
import { resetDocToView } from './ViewDocument/ViewDocumentSlice';
import { resetDocToSign } from './SignDocument/SignDocumentSlice';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Status,
  Tabs,
  Tag,
} from 'gestalt';
import 'gestalt/dist/gestalt.css';

const GestaltBoxHeaderColor = 'darkWash';
const GestaltBodyHeaderColor = 'lightGray';
const MarginBetweenBoxes = 4;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [numPendingDocsToSign, /* setNumPendingDocsToSign */] = useState(0);
  const [numPendingDocsToSignFromOthers, /* setNumPendingDocsToSignFromOthers */] = useState(0);
  const [numOfDocsSigned,  /* setNumOfDocsSigned */] = useState(0);

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    dispatch(resetDocToView());
    dispatch(resetDocToSign());
  }, [dispatch]);

  const ModeSwitchingTabs = () => {
    const handleChange = ({ activeTabIndex, event }) => {
      event.preventDefault();
      setActiveTabIndex(activeTabIndex)
    };

    /**
     * @todo Add API call to check if there are new, unseen activity
     * in either Request or Sign tabs
     */
    const tabs = [
      {
        text: "Request",
        // indicator: "dot"
      },
      {
        text: "Sign",
        // indicator: "dot"
      },
    ];

    return (
      <Flex alignItems="center" direction="column" gap={4}>
        <Box padding={1}>
          <Tabs
            activeTabIndex={activeTabIndex}
            bgColor="transparent"
            onChange={handleChange}
            tabs={tabs}
          />
        </Box>
      </Flex>
    );
  }

  return (
    <div>
      <Profile />
      <Container>
        <ModeSwitchingTabs/>
        <Box marginTop={MarginBetweenBoxes} marginBottom={MarginBetweenBoxes}>
          <Box padding={3} color={GestaltBoxHeaderColor}>
            <Flex alignItems="center" gap={2}>
              <Heading size="md">
                {`Sign Documents`}
              </Heading>
              {
                /**
                 * @todo 2021-10-08
                 * 1. Find a better component compared to `Tag` for displaying the
                 * number?
                 * 2. @andrey Need API to conditionally render the number in the
                 * `Tag` and the correct Status
                 */
              }
              <Tag disabled text={`${numPendingDocsToSign}`}></Tag>
              {
                (!numPendingDocsToSign && <Status type="ok" title="No Pending Documents"/>)
                || (numPendingDocsToSign && <Status type="inProgress" title="Pending Documents"/>)
              }
            </Flex>
          </Box>
          <Box padding={3} color={GestaltBodyHeaderColor}>
            <SignList />
          </Box>
        </Box>
        <Box marginTop={MarginBetweenBoxes} marginBottom={MarginBetweenBoxes}>
          <Box padding={3} color={GestaltBoxHeaderColor}>
            <Heading size="md">{`Prepare Document`}</Heading>
          </Box>
          <Box padding={2} color={GestaltBodyHeaderColor}>
            <Button
              onClick={event => {
                navigate(`/assignUsers`);
              }}
              text="Prepare Document for Signing"
              color="blue"
              inline
            />
          </Box>
        </Box>
        <Box marginTop={MarginBetweenBoxes} marginBottom={MarginBetweenBoxes}>
          <Box padding={3} color={GestaltBoxHeaderColor}>
            <Flex alignItems="center" gap={2}>
              <Heading size="md">Pending Other Signers</Heading>
              {
                /**
                 * @todo 2021-10-08
                 * 1. Find a better component compared to `Tag` for displaying the
                 * number?
                 */
              }
              <Tag disabled text={`${numPendingDocsToSignFromOthers}`}></Tag>
            </Flex>
            {
              /**
               * @todo 2021-10-08
               * Refactor Lists/SignedList component so we can re-use it for this?
               */
            }
          </Box>
          <Box padding={3} color={GestaltBodyHeaderColor}>
            There are no documents pending other signers
          </Box>
        </Box>
        <Box marginTop={MarginBetweenBoxes} marginBottom={MarginBetweenBoxes}>
          <Box padding={3} color={GestaltBoxHeaderColor}>
            <Flex alignItems="center" gap={2}>
              <Heading size="md">{`Review Signed Documents`}</Heading>
              {
                /**
                 * @todo 2021-10-08
                 * 1. Find a better component compared to `Tag` for displaying the
                 * number?
                 */
              }
              <Tag disabled text={`${numOfDocsSigned}`}></Tag>
            </Flex>
          </Box>
          <Box padding={3} color={GestaltBodyHeaderColor}>
            <SignedList />
          </Box>
        </Box>
      </Container>
    </div>
  );
};
export default ProfilePage;
