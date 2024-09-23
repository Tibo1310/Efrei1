const mongoose = require('mongoose');
const Post = require('../../models/Post');

describe('Post Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create & save post successfully', async () => {
    const validPost = new Post({
      title: 'Test Post',
      content: 'This is a test post',
      author: new mongoose.Types.ObjectId()
    });
    const savedPost = await validPost.save();
    expect(savedPost._id).toBeDefined();
    expect(savedPost.title).toBe(validPost.title);
    expect(savedPost.content).toBe(validPost.content);
    expect(savedPost.author).toEqual(validPost.author);
  });

  it('should fail to save post without required fields', async () => {
    const invalidPost = new Post({ title: 'Invalid Post' });
    let err;
    try {
      await invalidPost.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should add a like to the post', async () => {
    const post = new Post({
      title: 'Likeable Post',
      content: 'This post can be liked',
      author: new mongoose.Types.ObjectId()
    });
    await post.save();

    const userId = new mongoose.Types.ObjectId();
    await post.addLike(userId);

    expect(post.likes).toHaveLength(1);
    expect(post.likes[0].toString()).toBe(userId.toString());
  });

  it('should remove a like from the post', async () => {
    const post = new Post({
      title: 'Unlikeable Post',
      content: 'This post can be unliked',
      author: new mongoose.Types.ObjectId()
    });
    const userId = new mongoose.Types.ObjectId();
    post.likes.push(userId);
    await post.save();

    await post.removeLike(userId);

    expect(post.likes).toHaveLength(0);
  });
});