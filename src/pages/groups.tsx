import React, { createContext, ReactElement, useContext, useMemo } from 'react';
import { Router } from '@reach/router';
import NotFoundPage from './404';
import Groups from '../mobx/GroupsStore';
import GroupSelectPage from '../components/Groups/GroupSelectPage';
import GroupsStore from '../mobx/GroupsStore';
import GroupPage from '../components/Groups/GroupPage/GroupPage';
import PostPage from '../components/Groups/PostPage/PostPage';
import useFirebase from '../hooks/useFirebase';
import UserDataContext from '../context/UserDataContext/UserDataContext';
import ProblemPage from '../components/Groups/ProblemPage/ProblemPage';

export const GroupsContext = createContext<Groups>(null);

// wrapper because reach router types are bad.
const NotFoundPageWrapper = (props: any): ReactElement => {
  return <NotFoundPage {...props} />;
};

export default function GroupsRouter() {
  const firebase = useFirebase();
  const groupsStore = useMemo(() => {
    if (firebase) {
      return new GroupsStore(firebase);
    } else {
      return null;
    }
  }, [firebase]);

  // still loading?
  if (!groupsStore) return null;

  return (
    <GroupsContext.Provider value={groupsStore}>
      <Router basepath="/groups">
        <ProblemPage path="/:groupId/post/:postId/problems/:problemId" />
        <PostPage path="/:groupId/post/:postId" />
        <GroupPage path="/:groupId" />
        <GroupSelectPage path="/" />
        <NotFoundPageWrapper default />
      </Router>
    </GroupsContext.Provider>
  );
}