import axios from 'axios';

export const fetchUserProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/user/me');
    dispatch({
      type: 'FETCH_USER_PROFILE_SUCCESS',
      payload: res.data.data,
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_USER_PROFILE_FAIL',
      payload: error.response.data.message,
    });
  }
};
