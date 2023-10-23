import { API_URLS, getFormBody, LOCALSTORAGE_TOKEN_KEY } from '../utils';

const customFetch = async (url, { body, ...customConfig }) => {
  const token = window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);

  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = getFormBody(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (data.success) {
      return {
        data: data.data,
        success: true,
      };
    }

    throw new Error(data.message);
  } catch (error) {
    console.error('error');
    return {
      message: error.message,
      success: false,
    };
  }
};

export const getPosts = (page = 1, limit = 20) => {
  return customFetch(API_URLS.posts(page, limit), {
    method: 'GET',
  });
};

export const login = (email, password) => {
  return customFetch(API_URLS.login(), {
    method: 'POST',
    body: { email, password },
  });
};

export const signUp = async (name, email, password, confirmPassword) => {
  return customFetch(API_URLS.signup(), {
    method: 'POST',
    body: { name, email, password, confirm_password: confirmPassword },
  });
};

export const editUser = async (userId, name, password, confirmPassword) => {
  return customFetch(API_URLS.editUser(), {
    method: 'POST',
    body: {id: userId, name, password, confirm_password: confirmPassword}
  });
}

export const fetchUserProfile = async (userId) => {
  return customFetch(API_URLS.userInfo(userId), {
    method: 'GET',
  });
}

export const createFriendship = async (userId) => {
  return customFetch(API_URLS.createFriendship(userId), {
    method: 'POST'
  });
}

export const fetchFriendsList = async () => {
  return customFetch(API_URLS.friends(), {
    method: 'GET'
  });
}

export const removeFriendship = async (userId) => {
  return customFetch(API_URLS.removeFriend(userId), {
    method: 'POST'
  });
}

export const createNewPost = (content) => {
  return customFetch(API_URLS.createPost(), {
    method: 'POST',
    body: {content: content}
  });
}

export const addComment = (post_id, comment) => {
  return customFetch(API_URLS.comment(), {
    method: 'POST',
    body: {
      post_id: post_id,
      content: comment,
    }
  });
}

export const toggleLikes = async (itemId, itemType) => {
  return customFetch(API_URLS.toggleLike(itemId, itemType), {
    method: 'POST'
  });
}

export const deleteComment = async (comment_id) => {
  return customFetch(API_URLS.deleteComment(comment_id), {
    method: 'DELETE'
  });
}

export const searchUsers = async (text) => {
  return customFetch(API_URLS.searchUsers(text), {
    method: 'GET'
  });
}