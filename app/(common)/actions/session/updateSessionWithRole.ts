'use client';

export async function updateSessionWithRole(
  role: Rolestype,
  update: (data: unknown) => Promise<unknown>
) {
  try {
    const newRole = role;
    // Update the session using the passed update function
    const updateSession = await update({ role: newRole });
    // we will do a backend call pass down the role
    console.log('updateSession is this ', updateSession);
    return { success: true };
  } catch (error) {
    console.error('Error updating session:', error);
    return { error: 'Failed to update session' };
  }
}
