1. Models
In the User.get method, when there is no user found, the code creates a new ExpressError instance but does not throw it. This results in the error not being thrown and the function continuing to execute, potentially leading to unexpected behavior.

// TESTS BUG #1
// Attempting to get a non-existent user should throw a 404 error.

// FIXES BUG #1
// If no user is found, throw the ExpressError to properly handle the 404 case.
static async get(username) {
  const result = await db.query(
    `SELECT username,
              first_name,
              last_name,
              email,
              phone
       FROM users
       WHERE username = $1`,
    [username]
  );

  const user = result.rows[0];

  if (!user) {
    throw new ExpressError('No such user', 404);
  }

  return user;
}

2. routes / auth.js
In the router.post('/login') route, the User.authenticate method is not awaited, leading to a potential race condition. This can result in the user variable being a Promise instead of the actual user object, causing issues when trying to access user.admin.

// TESTS BUG #1
// Logging in with incorrect username/password should throw a 401 error.

// FIXES BUG #1
// Await the User.authenticate method to ensure user is resolved before proceeding.
router.post('/login', async function(req, res, next) {
  try {
    const { username, password } = req.body;
    let user = await User.authenticate(username, password);
    const token = createTokenForUser(username, user.admin);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
}); // end

3. routes / user.js
In the router.delete('/:username') route, the User.delete method is not awaited, potentially leading to the response being sent before the deletion operation is completed. This could result in the user receiving a success message even if the user was not actually deleted.

// TESTS BUG #1
// Deleting a user should not return a success message before ensuring the user is deleted.

// FIXES BUG #1
// Await the User.delete method to ensure the user is deleted before sending the response.
router.delete('/:username', authUser, requireAdmin, async function(
  req,
  res,
  next
) {
  try {
    await User.delete(req.params.username);
    return res.json({ message: 'deleted' });
  } catch (err) {
    return next(err);
  }
}); // end

6. Middleware
 The authUser middleware sets req.curr_username and req.curr_admin even when the token is invalid or expired. This could lead to unauthorized access if the token is not properly verified.

// TESTS BUG #1
// An invalid or expired token should result in a 401 Unauthorized error.
// Assume that jwt.decode always returns a payload with username and admin properties.

// FIXES BUG #1
// Verify the token using jwt.verify instead of jwt.decode to ensure it's valid.
function authUser(req, res, next) {
  try {
    const token = req.body._token || req.query._token;
    if (token) {
      let payload = jwt.verify(token, SECRET_KEY);
      req.curr_username = payload.username;
      req.curr_admin = payload.admin;
    }
    return next();
  } catch (err) {
    err.status = 401;
    return next(err);
  }
} // end