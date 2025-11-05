import { Pressable } from 'react-native';
import { useNavigate } from 'react-router-native';
import RepositoryItem from './RepositoryItem';

const RepositoryListItem = ({ repository }) => {
  const navigate = useNavigate();

  const handlePress = () => {
    navigate(`/repository/${repository.id}`);
  };

  return (
    <Pressable onPress={handlePress}>
      <RepositoryItem repository={repository} showGitHubButton={false} />
    </Pressable>
  );
};

export default RepositoryListItem;