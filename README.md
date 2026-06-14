# SpeedBump

Admit it: you have a problem. You're at your terminal, your
mind wanders, and suddenly you're looking at the latest clickbait
garbage on -- well, wherever you like to consume your clickbait
garbage.

You don't have to face your demons alone. SpeedBump can help.

SpeedBump is a simple Firefox extension to put a little, well,
speed bump into your mindless browsing. Configure a list of
sites, and the extension will require an affirmative confirmation
to continue. 

Is consuming that Tweet critical? Is some deep truth locked away
in Reddit? No problem: click on through. But now you're browsing
intentionally.

## Configuration

Add a list of your problem sites:
1. Click the SpeedBump icon in the toolbar, or right-click
   and select "Manage Extension" → "Options".
2. Add domains to the confirm list (one per line).
3. Click "Save Settings".

Your guilty secrets are safe with SpeedBump: nothing is stored
except in your local browser.

Don't bother getting fancy; SpeedBump uses very simple domain
matching:
- Wildcards are included: `reddit.com` matches `reddit.com` and `*.reddit.com`
- Matching is case-insensitive.
- Only the domain is checked (not the full path).

## Usage

Once configured:
1. Try to navigate to any URL matching a domain in your list.
2. You'll see a confirmation page asking if you want to proceed.
3. Click "Yes, Load Page" to continue, or "Cancel" to go back.
   The default selection is to cancel, so hitting Enter will take
   you back, too.

## FAQ

### Is this supported?

Absolutely not.

### Can I contribute?

I'm not taking any pull requests directly. But please fork and
let me know if you've done something cool in the GitHub 
Discussion.

### Is this vibe coded?

I'm not quite sure what that means anymore, but Claude and I
did work together closely to put this together.

### Do you have a website?

I'm not a Luddite; [of course I do](https://stdin.org).

## License

MIT License

Copyright (c) 2026 Isaac Kunen

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
