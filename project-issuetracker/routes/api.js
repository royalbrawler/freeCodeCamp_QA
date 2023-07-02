'use strict';
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const IssueModel = require('../models').Issue
const ProjectModel = require('../models').Project

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let projectName = req.params.project;
      //  /api/issues/{project}?open=true&assigned_to=Joe
      const { _id, open, issue_title, issue_text, created_by, assigned_to, status_text } = req.query

      const _$matchGenerator = (type, value) => {
        // Generates objects
        // positive Example: { $match: { "issues._id": ObjectId(_id) }}
        // negative Example: { $match: { }}
        if (type && value) return { $match: { [type]: value } }
        else if (!type || !value) return { $match: {} }
      }
      ProjectModel.aggregate([
        { $match: { name: projectName } },
        { $unwind: "$issues" },
        _$matchGenerator('issues._id', (_id ? new ObjectId(_id) : _id)),
        _$matchGenerator('issues.open', open),
        _$matchGenerator('issues.issue_title', issue_title),
        _$matchGenerator('issues.issue_text', issue_text),
        _$matchGenerator('issues.created_by', created_by),
        _$matchGenerator('issues.assigned_to', assigned_to),
        _$matchGenerator('issues.status_text', status_text),
      ]).then((result) => {
        if (!result) {
          res.json([])
        } else {
          let mappedData = result.map(item => item.issues)
          res.json(mappedData)
        }
      }).catch((err) => { console.error(err) });

    })

    .post(function (req, res) {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' })
      }

      const newIssue = new IssueModel({
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        open: true,
        status_text: status_text || ""
      })

      ProjectModel.findOne({ name: project }).then((projectData) => {
        if (!projectData) {
          const newProject = new ProjectModel({ name: project })
          newProject.issues.push(newIssue)
          newProject.save().then((savedData) => {
            if (savedData) {
              res.json(newIssue)
            }
          }).catch((err) => {
            res.send('There was an error saving in POST')
          })
        } else {
          projectData.issues.push(newIssue)
          projectData.save().then((savedData) => {
            if (savedData) {
              res.json(newIssue)
            }
          }).catch((err) => {
            res.send('There was an error saving in POST')
          })
        }
      }).catch((err) => { console.log(err); })
    })

    .put(function (req, res) {
      let project = req.params.project;
      const { _id, open, issue_title, issue_text, created_by, assigned_to, status_text } = req.body
      if (!_id) {
        return res.json({ error: 'missing _id' })
      }
      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
        return res.json({ error: 'no update field(s) sent', '_id': _id })
      }

      ProjectModel.findOne({ name: project }).then((projectData) => {
        if (!projectData) {
          return res.json({ error: 'could not update', '_id': _id })
        } else {
          const issueData = projectData.issues.id(_id)
          if (!issueData) {
            return res.json({ error: 'could not update', '_id': _id })
          }
          issueData.issue_title = issue_title || issueData.issue_title
          issueData.issue_text = issue_text || issueData.issue_text
          issueData.created_by = created_by || issueData.created_by
          issueData.assigned_to = assigned_to || issueData.assigned_to
          issueData.status_text = status_text || issueData.status_text
          issueData.updated_on = new Date()
          issueData.open = open

          projectData.save().then(result => {
            if (result) {
              return res.json({ result: 'successfully updated', '_id': _id })
            }
          }).catch(err => res.json({ error: 'could not update', '_id': _id }))
        }
      }).catch((err) => { console.log(err); })

    })

    .delete(function (req, res) {
      let project = req.params.project;
      const { _id } = req.body
      if (!_id) {
        return res.json({ error: 'missing _id' })
      }

      ProjectModel.findOne({ name: project }).then((projectData) => {
        if (!projectData) {
          return res.json({ error: 'could not delete', '_id': _id })
        } else {
          const issueData = projectData.issues.id(_id)
          if (!issueData) {
            return res.json({ error: 'could not delete', '_id': _id })
          }
          issueData.deleteOne()

          projectData.save().then(result => {
            if (result) {
              return res.json({ result: 'successfully deleted', '_id': issueData._id })
            }
          }).catch(err => res.json({ error: 'could not delete', '_id': issueData._id }))
        }
      }).catch((err) => { console.log(err); })

    });

};
