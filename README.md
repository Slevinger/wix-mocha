# Mini Mocha

Hello! In this assignment we will try to implement a very basic test runner. Our test runner is going to support a subset of the [mocha](https://mochajs.org/) API. If you are not familiar with it, plz take some time to go over their documentation.

To get started simply run following commands:

```
$ npm install
$ npm test
```

After running `npm test` you should see something similar to this:

```
  ✔ should have correct output for 00-single-passing-test (49ms)
  1) should have correct output for 01-single-failing-test
  2) should have correct output for 02-describe
  3) should have correct output for 03-nested-describe
  4) should have correct output for 04-test-and-suites-with-failures
  5) should have correct output for 05-before-each
  6) should have correct output for 06-exclusive

  1 passing (372ms)
  6 failing
      
  ...
  ...
  ...
```

The first test is passing thanks to a very naive implementation which is already included in this assignment code. Your job is to make the rest of the tests pass. You are only allowed to change files in `src` folder, the `test` folder should remain as it is.

As you can see, the test code is pretty simple. All it does is spawn your implementation in a new node process and each time passes a different `.spec.js` file from `test/fixtures` directory. Then it compares the output of your implementation to the corresponding `.expected.txt` file in `test/fixtures`. Also, just to make things more comfortable for you, it writes the output of your implementation to the `.actual.txt` file in `test/fixtures` so you can easily compare between expected and actual output.

The output that is expected from your implementation is very similar to the output shown above, just take a look in `test/fixtures/*.expected.txt` and see. The main idea is that:

1. Each test suite (`describe`) displays a title and padded according to its nesting level
2. Each passing test is listed with `✓`, followed by its description
3. Each failing test is listed with `X)`, followed by its description, where `X` is actually a reference number to the detailed errors below
4. Summary includes the number of passing tests. If there were any failures, summary includes also the number of failing tests and list of detailed errors which were referenced above.

Hint: the detailed error is simply `err.toString()` of the exception thrown by the test.

## What's expected of your implementation

1. Pass all of the tests
2. Refactor your code until you are proud of it
3. Installing additional node_modules is allowed (although usually not necessary)
4. Upload archive of projext folder to dropbox, google drive, or any other similar service
5. **Do not** send email attachments because it might get filtered out by our mail servers
6. **Do not** upload solution to github, bitbucket or any other public repository

## Bonus task 1

See how mocha lets you know how long running each test took? (search for 80ms/923ms in this file)

Add this feature **and an appropriate test** for it to your implementation, adding timing info for successful tests and also in the summary for the complete run. Hint: print timing info only if an additional command line param is passed to your program, this way you won't break any of the existing tests.

## Bonus task 2

Add a feature **and an appropriate test** which fails & kills any test that takes longer than 5 seconds to run. This means that if we have a test which takes 60 seconds to run, your implementation should abort running of this test after 5 seconds and move on to the next test, it should not let it continue running for the additional 55 seconds.

### Good luck!!!
