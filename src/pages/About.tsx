import React from 'react';

const About = (): JSX.Element => (
  <div>
    <h2>About</h2>
    <p>
      Hi, my name is Mark. I'm a math tutor at University of Wisconsin-Madison,
      and I want to create a site to better serve students struggling in math.
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
    <h3>Acknowledgements</h3>
    <p>
      The structure of the lessons on this site was heavily inspired by{' '}
      <a href="https://tutorial.math.lamar.edu">Paul Dawkins' online notes</a>.
      Those notes have been an awesome reference for me, both as a student and
      as a tutor.
    </p>
    <h3>Miscellaneous</h3>
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
      Everything about this website is open source. For the techies out there,
      you can view the GitHub repo{' '}
      <a href="https://github.com/mark-wiemer/mark-wiemer.github.io">here</a>.
    </p>
  </div>
);

export default About;
