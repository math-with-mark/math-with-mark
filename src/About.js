import React from 'react';
import Alert from 'react-bootstrap/Alert';

export const About = () => (
    <div>
        <Alert variant="primary">This site is under construction.</Alert>
    <p>
      Hi, my name is Mark. I'm a math tutor at University of Wisconsin-Madison,
      and I wanted to create a site to better serve students struggling in math.
    </p>
    <p>
      This site offers supplemental learning material that I believe is
      difficult to find elsewhere. Primarily, I focus on abstract
      problem-solving methods that can be applied to families of problems. With
      the materials on my site, I aim to help students become unstuck while
      completing assignments. In this way, I hope to empower students and
      instill in them confidence in their abilities to tackle large, complex
      problems.
    </p>
    <p>
      Everything about this website is open source. For the techies out there,
      you can view the GitHub repo{' '}
      <a href="https://github.com/mark-wiemer/mark-wiemer.github.io">here</a>.
    </p>
    <p>
      If you find any issues, points of confusion, or weird behaviors with the
      website, please{' '}
      <a href="https://github.com/mark-wiemer/mark-wiemer.github.io/issues/new">
        contact me here
      </a>{' '}
      (a free GitHub account is required). I'm also open to any general feedback
      about the site through that link.
    </p>
    <p>
      <a href="index.html">Home</a>
    </p>
  </div>
);
