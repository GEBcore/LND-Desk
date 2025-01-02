import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Pwd from '@/pages/Create/Pwd';
import Tab from '@/pages/Create/Tab';
import { useCreateStore } from '@/store/create';

function Create() {
  const navigate = useNavigate();
  const { toast } = useToast()
  const {status} = useCreateStore()


  return (
    <div className='dark flex flex-col items-center justify-center h-screen mx-w-full'>
      {status === 'pwd' ? <Pwd/> :  <Tab/>}
    </div>
  )
}

export default Create
