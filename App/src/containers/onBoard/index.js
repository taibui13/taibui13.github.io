import { connect } from 'react-redux';
import OnBoard from './view/onBoard';
import { getUser, selectData, filterUsers, setData } from './modules/dispatchHandler';

const mapDispatchToProps = {
  getUser,
  selectData, 
  filterUsers,
  setData
}

const mapStateToProps = (state) => ({
  responseData : state.securityReducer,
  commonReducer: state.commonReducer
})


export default connect(mapStateToProps, mapDispatchToProps)(OnBoard);